# RoPhim Clone - Movie Streaming Website

Một website clone của RoPhim.me được xây dựng bằng Next.js, TypeScript và Tailwind CSS.

## 🎬 Giới thiệu

RoPhim Clone là một nền tảng xem phim trực tuyến miễn phí, được thiết kế để mang lại trải nghiệm tương tự như website RoPhim.me gốc. Website hỗ trợ xem phim HD, phim 4K với giao diện hiện đại và responsive.

## ✨ Tính năng chính

- **🎥 Giao diện hiện đại**: Thiết kế responsive, tối ưu cho mọi thiết bị
- **🔍 Tìm kiếm thông minh**: Tìm kiếm phim theo tên, thể loại, quốc gia
- **📱 Responsive Design**: Hoạt động mượt mà trên desktop, tablet và mobile
- **🎭 Phân loại đa dạng**: Phim theo thể loại, quốc gia, năm phát hành
- **⭐ Đánh giá phim**: Hệ thống rating và review
- **🎪 Hero Carousel**: Slider hiển thị phim nổi bật
- **🎬 Movie Grid**: Lưới hiển thị phim với thông tin chi tiết
- **🌙 Dark Theme**: Giao diện tối mắt thân thiện

## 🚀 Công nghệ sử dụng

- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image Component
- **Font**: Inter (Google Fonts)

## 🛠️ Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js 18.x trở lên
- npm hoặc yarn

### Cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd web-rophim
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Chạy development server:

```bash
npm run dev
```

4. Mở browser và truy cập: `http://localhost:3000`

### Scripts có sẵn

```bash
# Chạy development server
npm run dev

# Build cho production
npm run build

# Chạy production server
npm run start

# Chạy linter
npm run lint
```

## 📁 Cấu trúc dự án

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── HeroSection.tsx    # Hero carousel
│   ├── MovieCard.tsx      # Movie card component
│   └── MovieGrid.tsx      # Movie grid layout
├── data/                  # Mock data
│   └── movies.ts          # Sample movie data
├── lib/                   # Utility functions
│   └── utils.ts           # Helper utilities
└── types/                 # TypeScript types
    └── movie.ts           # Movie type definitions
```

## 🎨 Thiết kế

Website được thiết kế dựa trên phân tích của RoPhim.me gốc với các đặc điểm:

### Header

- Logo RoPhim
- Navigation menu với dropdown thể loại và quốc gia
- Search bar
- Mobile responsive menu

### Hero Section

- Carousel hiển thị phim nổi bật
- Auto-play với navigation controls
- Movie information overlay
- Call-to-action buttons

### Movie Grid

- Grid layout responsive (2-6 columns tùy screen size)
- Movie cards với poster, rating, thông tin chi tiết
- Hover effects và animations
- Category sections

### Footer

- Company information
- Quick links
- Social media links
- Copyright information

## 📱 Responsive Design

- **Mobile**: 2 columns grid
- **Tablet**: 3-4 columns grid
- **Desktop**: 5-6 columns grid
- **Large Desktop**: 6+ columns grid

## 🎭 Thể loại phim hỗ trợ

- Hành động
- Tình cảm
- Khoa học viễn tưởng
- Cổ trang
- Hoạt hình
- Kinh dị
- Võ thuật
- Tâm lý
- Hài hước
- Phiêu lưu

## 🌍 Quốc gia

- Việt Nam 🇻🇳
- Hàn Quốc 🇰🇷
- Trung Quốc 🇨🇳
- Thái Lan 🇹🇭
- Nhật Bản 🇯🇵
- Âu Mỹ 🇺🇸

## 🚧 Tính năng sắp tới

- [ ] Trang chi tiết phim
- [ ] Video player tích hợp
- [ ] Tìm kiếm nâng cao
- [ ] Lọc phim theo multiple criteria
- [ ] User authentication
- [ ] Danh sách yêu thích
- [ ] Comment và rating system
- [ ] API integration cho data thực

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

Dự án này được phát triển cho mục đích học tập và nghiên cứu.

## 📞 Liên hệ

Nếu có bất kỳ câu hỏi nào, vui lòng tạo issue trên GitHub.

---

**Lưu ý**: Đây là project demo được xây dựng để học tập, không phải website thương mại. Tất cả dữ liệu phim đều là mock data cho mục đích demo.
