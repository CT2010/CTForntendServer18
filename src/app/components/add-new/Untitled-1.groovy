
    // Sử dụng FileReader để đọc nội dung của file CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result; // Nội dung của file CSV

      // Hiển thị nội dung trên trang web
      const displayElement = document.getElementById('csv-content');
      if (displayElement) {
        displayElement.innerText = content as string;
      }

      // Log nội dung vào console
      console.log(content);
    };
    reader.readAsText(file); // Đọc file dưới dạng văn bản

    // tạm thời ngưng code phần sau bằng lệnh return
    // return;