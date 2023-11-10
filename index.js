// https://github.com/joker-cat/-/blob/main/image/%E4%BC%81%E9%B5%9D.gif?raw=true
let data;
let searchGetCount = document.querySelector('.search-getCount');
const sec2Container = document.querySelector('.sec2-container');
const filterArea = document.querySelector('.filter-area');
const newTicketBtn = document.querySelector('.btn');
let isImg = document.querySelector('.is-img');
let jsonUrl = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json'

axios.get(jsonUrl)
    .then((res) => {
        data = res.data.data;
    })
    .catch((err) => {
        console.log(err);
        Swal.fire({
            icon: "error",
            title: "抓取失敗",
            text: "請確認網址"
        });
    })
    .finally(() => {
        if (Array.isArray(data)) {
            showTicket(data)
        } else {
            Swal.fire({
                icon: "error",
                title: "顯示失敗",
                text: "請確認資料來源是否為JSON格式"
            });
        }
    });

newTicketBtn.addEventListener('click', () => {
    const valueSet = [...document.querySelectorAll('.is-null')];
    if (valueSet.find((e) => e.value.trim() === '')) {
        Swal.fire({
            icon: "error",
            title: "新增失敗",
            text: "欄位未填寫確實"
        });
        return
    };
    isImage(isImg.value)
        .then((bool) => {
            let imbBool = bool;
            let allFiled = true;
            const valueSet = document.querySelectorAll('.is-null');
            valueSet.forEach((e) => e.value.trim() === '' ? allFiled = false : allFiled = allFiled);
            if (imbBool == true && allFiled) {
                let inputValuesObject = Array.from(valueSet).reduce((acc, input) => {
                    acc[input.name] = input.value;
                    return acc;
                }, {});
                data.push({ ...inputValuesObject, "id": data.length });
                showTicket(data);
                Swal.fire({
                    icon: "success",
                    title: "新增成功",
                    text: "請往下察看確認"
                });
            } else {
                let inputValuesObject = Array.from(valueSet).reduce((acc, input) => {
                    acc[input.name] = input.value;
                    return acc;
                }, {});
                inputValuesObject.imgUrl = "https://github.com/joker-cat/-/blob/main/image/img_no_found.png?raw=true";
                data.push({ ...inputValuesObject, "id": data.length });
                showTicket(data);
                Swal.fire({
                    icon: "error",
                    title: "圖片獲取失敗",
                    text: "請再次確認圖片來源"
                });
            }
        }).catch((err) => {
            console.log(err);
        });

});
filterArea.addEventListener('change', (e) => {
    const getValue = e.target.value;
    (getValue === "全部地區") ? showTicket(data) : getChange(getValue);
});

function isImage(url) {
    return new Promise((resolve, reject) => {

        // 建立一個 Image 物件
        var img = new Image();

        // 設定圖片的來源為要檢查的網址
        img.src = url;

        // 設定圖片載入完成的處理函式
        img.onload = function () {
            console.log('這是一張圖片！');
            resolve(true)
        };

        // 設定圖片載入失敗的處理函式
        img.onerror = function () {
            console.log('這不是一張圖片。');
            resolve(false)
        };
    })
}

function getChange(value) {
    const filterData = data.filter((e) => e.area === value);
    showTicket(filterData);
};

function showTicket(arr) {
    let strTemplate = '';
    for (const i of arr) {
        strTemplate +=
            `
            <div class="ticket-card">
                <mark>${i.area}</mark>
                <div class="ticket-cart-content">
                    <span class="scroe">${i.rate}</span>
                    <img class="img-set" src="${i.imgUrl}" alt="">
                    <h3>${i.name}</h3>
                    <p class="describe">${i.description}</p>
                    <div class="remaining">
                        <div class="remaining-count">剩下最後 ${i.group} 組</div>
                        <div style="display: flex;align-items: center;">
                            <span class="twd">TWD</span>
                            <p class="ticket-price">$${i.price.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            `
    }
    sec2Container.innerHTML = strTemplate;
    searchGetCount.textContent = `本次搜尋共 ${arr.length} 筆資料`
};