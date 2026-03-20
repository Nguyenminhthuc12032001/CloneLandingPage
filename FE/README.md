# TransViet Homepage Clone

Project này dùng `React + TypeScript + Vite` để host một bản clone của homepage `transviet.com.vn`.

## Scripts

- `npm run dev`: chạy môi trường local
- `npm run build`: build production
- `npm run preview`: preview bản build
- `npm run lint`: kiểm tra lint

## Cấu trúc chính

- `src/App.tsx`: entry component
- `src/pages/HomePage.tsx`: page-level entry cho homepage clone
- `src/components/EmbeddedPageFrame.tsx`: wrapper render clone page
- `src/config.ts`: config dùng chung
- `public/transviet-clone.html`: snapshot homepage clone
- `public/transviet-local-fixes.css`: các bản vá local tách riêng khỏi snapshot
- `public/Content/font-awesome.css`: local CSS cho icon font
- `public/fonts/`: local font assets

## Ghi chú

Snapshot trong `public/transviet-clone.html` đã được chỉnh để:

- trỏ asset về đúng nguồn
- giữ output bám sát bản gốc nhất có thể

Phần fix local được giữ riêng trong `public/transviet-local-fixes.css` để snapshot HTML ít bị sửa tay hơn.
