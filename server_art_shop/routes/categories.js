const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/authMiddleware');

// Lấy tất cả danh mục (Ai cũng xem được để hiện lên dropdown)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Thêm danh mục (Chỉ Admin)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, description } = req.body;
        const categoryExists = await Category.findOne({ name });

        if (categoryExists) {
            return res.status(400).json({ message: 'Danh mục đã tồn tại' });
        }

        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo' });
    }
});

// Xóa danh mục (Chỉ Admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa danh mục' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa' });
    }
});

module.exports = router;