const {db, bucket, FieldValue} = require("../common/firebaseAdmin");
const sharp = require("sharp");

const imagesCol = db.collection("images");
const categoriesCol = db.collection("categories");
const reportsCol = db.collection("reports");

const uploadImage = async (req, res) => {
  try {
    const {categoryId, categoryName} = req.body || {};
    const filesPayload = req.files || {};
    const files = Array.isArray(filesPayload) ? filesPayload : [
      ...(filesPayload.images || []),
      ...(filesPayload.image || []),
      ...(req.file ? [req.file] : []),
    ];

    if (!files.length) {
      return res.status(400).json({message: "No files uploaded"});
    }

    let resolvedCategoryId = categoryId;

    if (!resolvedCategoryId && categoryName) {
      const trimmedName = categoryName.trim();
      if (!trimmedName) {
        return res.status(400).json({message: "Invalid categoryName"});
      }

      const norm = trimmedName.toLowerCase();
      const catQuery = await categoriesCol
          .where("normalizedName", "==", norm)
          .limit(1)
          .get();

      if (catQuery.docs[0] && catQuery.docs[0].exists) {
        resolvedCategoryId = catQuery.docs[0].id;
      } else {
        const catRef = await categoriesCol.add({
          name: trimmedName,
          normalizedName: norm,
          createdAt: FieldValue.serverTimestamp(),
        });
        resolvedCategoryId = catRef.id;
      }
    }

    if (!resolvedCategoryId) {
      return res.status(400).json({
        message: "categoryId or categoryName is required",
      });
    }

    const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const thumbBuffer = await sharp(file.buffer)
              .resize(200, 200, {fit: "inside"})
              .toBuffer();

          const imgRef = await imagesCol.add({
            categoryId: resolvedCategoryId,
            fileName: file.originalname,
            size: file.size,
            contentType: file.mimetype,
            favouriteCount: 0,
            downloadCount: 0,
            createdAt: FieldValue.serverTimestamp(),
          });

          if (bucket) {
            const fullPath = `images/${imgRef.id}/${file.originalname}`;
            const f = bucket.file(fullPath);
            await f.save(file.buffer, {
              metadata: {contentType: file.mimetype},
            });
            await imgRef.update({storagePath: fullPath});
          }

          await imgRef.update({
            thumbBase64: thumbBuffer.toString("base64"),
            thumbContentType: file.mimetype,
          });

          const doc = await imgRef.get();
          return {id: doc.id, ...doc.data()};
        }),
    );

    res.status(201).json({
      success: true,
      count: uploadedImages.length,
      data: uploadedImages,
    });
  } catch (err) {
    console.error("Image upload failed:", err);
    res.status(500).json({message: err.message});
  }
};

const getAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = (req.query.search || "").trim().toLowerCase();
    const categoryFilter = (req.query.category || "").trim();

    let q = imagesCol.orderBy("createdAt", "desc");

    if (categoryFilter) {
      const catQ = await categoriesCol
          .where("normalizedName", "==", categoryFilter.toLowerCase())
          .limit(1)
          .get();
      if (catQ.docs[0] && catQ.docs[0].exists) {
        q = q.where("categoryId", "==", catQ.docs[0].id);
      } else {
        return res.status(200).json({
          success: true,
          data: [],
          currentPage: page,
          totalPages: 0,
        });
      }
    }

    const totalSnapshot = await q.get();
    const total = totalSnapshot.size;

    const snapshot = await q.offset(skip).limit(limit).get();
    const docs = snapshot.docs;

    const categoryIds = Array.from(
        new Set(docs.map((d) => d.data().categoryId).filter(Boolean)),
    );
    const categoriesMap = {};
    if (categoryIds.length) {
      const cats = await Promise.all(
          categoryIds.map((id) => categoriesCol.doc(id).get()),
      );
      cats.forEach((c) => {
        if (c.exists) {
          categoriesMap[c.id] = c.data().name;
        }
      });
    }

    let images = docs.map((doc) => ({_id: doc.id, ...doc.data()}));

    if (searchQuery) {
      images = images.filter((item) => {
        const fileName = (item.fileName || "").toLowerCase();
        const catName = (categoriesMap[item.categoryId] || "").toLowerCase();
        return (
          fileName.includes(searchQuery) ||
          catName.includes(searchQuery)
        );
      });
    }

    const formattedImages = images.map((item) => ({
      imageId: item._id,
      _id: item._id,
      categoryId: item.categoryId,
      fileName: item.fileName,
      size: item.size,
      category: categoriesMap[item.categoryId] || "Unknown",
      contentType: item.contentType,
      createdAt: item.createdAt,
      favouriteCount: item.favouriteCount || 0,
      downloadCount: item.downloadCount || 0,
      thumbUrl:
        item.thumbBase64 && item.thumbContentType ?
          `data:${item.thumbContentType};base64,${item.thumbBase64}` :
          null,
    }));

    res.status(200).json({
      success: true,
      data: formattedImages,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Fetching images failed:", err);
    res.status(500).json({message: err.message});
  }
};

const updateImageStats = async (req, res) => {
  try {
    const {imageId, isLiked, isDownload} = req.body || {};
    if (!imageId) {
      return res.status(400).json({message: "Invalid imageId"});
    }

    const imgRef = imagesCol.doc(imageId);
    const imgDoc = await imgRef.get();
    if (!imgDoc.exists) {
      return res.status(404).json({message: "Image not found"});
    }

    let originalImage = null;

    await db.runTransaction(async (tx) => {
      const d = (await tx.get(imgRef)).data();
      const update = {};
      if (isLiked) {
        update.favouriteCount = (d.favouriteCount || 0) + 1;
      }
      if (isDownload) {
        update.downloadCount = (d.downloadCount || 0) + 1;
      }
      tx.update(imgRef, update);

      if (isDownload && d.storagePath && bucket) {
        const file = bucket.file(d.storagePath);
        const [buf] = await file.download();
        originalImage =
          `data:${d.contentType};base64,${buf.toString("base64")}`;
      }
    });

    const updated = (await imgRef.get()).data();

    res.status(200).json({
      success: true,
      data: {
        favouriteCount: updated.favouriteCount || 0,
        downloadCount: updated.downloadCount || 0,
        originalImage,
      },
    });
  } catch (err) {
    console.error("Updating images stats failed:", err);
    res.status(500).json({message: err.message});
  }
};

const getOriginalImage = async (req, res) => {
  try {
    const {imageId} = req.params || {};
    if (!imageId) {
      return res.status(400).json({message: "Invalid imageId"});
    }

    const imgRef = imagesCol.doc(imageId);
    const imgDoc = await imgRef.get();
    if (!imgDoc.exists) {
      return res.status(404).json({message: "Image not found"});
    }
    const d = imgDoc.data();

    if (!d.storagePath || !bucket) {
      return res.status(404).json({
        message: "Original image not found",
      });
    }

    const file = bucket.file(d.storagePath);
    const [buf] = await file.download();
    const originalImage =
      `data:${d.contentType};base64,${buf.toString("base64")}`;

    res.status(200).json({
      success: true,
      data: {
        imageId,
        fileName: d.fileName,
        originalImage,
      },
    });
  } catch (err) {
    console.error("Fetching original image failed:", err);
    res.status(500).json({message: err.message});
  }
};

const reportImage = async (req, res) => {
  try {
    const {categoryId, imageId, name, email, message} = req.body || {};
    if (!categoryId) {
      return res.status(400).json({message: "Invalid categoryId"});
    }
    if (!imageId) {
      return res.status(400).json({message: "Invalid imageId"});
    }

    const trimmedName = name && name.trim();
    const trimmedEmail = email && email.trim().toLowerCase();
    const trimmedMessage = message && message.trim();

    if (!trimmedName) {
      return res.status(400).json({message: "Name is required"});
    }
    if (!trimmedEmail) {
      return res.status(400).json({message: "Email is required"});
    }
    if (!trimmedMessage) {
      return res.status(400).json({message: "Message is required"});
    }

    const categoryDoc = await categoriesCol.doc(categoryId).get();
    if (!categoryDoc.exists) {
      return res.status(404).json({message: "Category not found"});
    }

    const imageDoc = await imagesCol.doc(imageId).get();
    if (!imageDoc.exists || imageDoc.data().categoryId !== categoryId) {
      return res.status(404).json({
        message: "Image not found for this category",
      });
    }

    const reportPayload = {
      categoryId,
      imageId,
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      createdAt: FieldValue.serverTimestamp(),
    };

    const reportRef = await reportsCol.add(reportPayload);

    if (req.file && bucket) {
      const fullPath = `reports/${reportRef.id}/${req.file.originalname}`;
      const f = bucket.file(fullPath);
      await f.save(req.file.buffer, {
        metadata: {contentType: req.file.mimetype},
      });
      await reportRef.update({
        reportImagePath: fullPath,
        fileName: req.file.originalname,
        size: req.file.size,
        reportImageContentType: req.file.mimetype,
      });
    }

    res.status(200).json({
      success: true,
      message: "Image reported successfully",
    });
  } catch (err) {
    console.error("Reporting image failed:", err);
    res.status(500).json({message: err.message});
  }
};

const getBlockedImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim().toLowerCase();

    const q = reportsCol.orderBy("createdAt", "desc");
    const totalSnap = await q.get();
    const docs = await q.offset(skip).limit(limit).get();

    let items = docs.docs.map((d) => ({_id: d.id, ...d.data()}));

    if (search) {
      items = items.filter((it) => {
        const name = (it.name || "").toLowerCase();
        const email = (it.email || "").toLowerCase();
        const message = (it.message || "").toLowerCase();
        return (
          name.includes(search) ||
          email.includes(search) ||
          message.includes(search)
        );
      });
    }

    const categoryIds = Array.from(
        new Set(items.map((i) => i.categoryId).filter(Boolean)),
    );
    const categoriesMap = {};
    if (categoryIds.length) {
      const cats = await Promise.all(
          categoryIds.map((id) => categoriesCol.doc(id).get()),
      );
      cats.forEach((c) => {
        if (c.exists) {
          categoriesMap[c.id] = c.data().name;
        }
      });
    }

    const data = await Promise.all(
        items.map(async (item) => {
          let reportImageUrl = null;
          if (item.reportImagePath && bucket) {
            const file = bucket.file(item.reportImagePath);
            try {
              const [buf] = await file.download();
              reportImageUrl =
                "data:" +
                item.reportImageContentType +
                ";base64," +
                buf.toString("base64");
            } catch (e) {
              reportImageUrl = null;
            }
          }
          return {
            reportId: item._id,
            imageId: item.imageId,
            categoryId: item.categoryId,
            name: item.name,
            email: item.email,
            message: item.message,
            fileName: item.fileName,
            size: item.size,
            category: categoriesMap[item.categoryId] || "Unknown",
            createdAt: item.createdAt,
            reportImageUrl,
          };
        }),
    );

    const total = totalSnap.size;

    res.status(200).json({
      success: true,
      data,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      total,
    });
  } catch (err) {
    console.error("Fetching blocked images failed:", err);
    res.status(500).json({message: err.message});
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  updateImageStats,
  getOriginalImage,
  reportImage,
  getBlockedImages,
};
