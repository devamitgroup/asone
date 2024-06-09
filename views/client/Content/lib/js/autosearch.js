// Chờ cho DOM được load hoàn toàn
document.addEventListener("DOMContentLoaded", function () {
  // Lấy phần tử input và nút tìm kiếm
  const inputKeyword = document.getElementById("keysearch");
  const searchButton = document.getElementById("searchhref");

  // Thêm sự kiện cho nút tìm kiếm
  searchButton.addEventListener("click", function (event) {
    // Ngăn chặn hành vi mặc định của nút tìm kiếm (chuyển hướng)
    event.preventDefault();

    // Lấy giá trị từ input
    const keywordValue = inputKeyword.value.trim();

    // Nếu giá trị không rỗng
    if (keywordValue !== "") {
      // Chuyển hướng đến trang kết quả tìm kiếm với tham số keyword
      window.location.href = `/san-pham/ket-qua-tim-kiem?keyword=${encodeURIComponent(
        keywordValue
      )}`;
    }
  });
});
