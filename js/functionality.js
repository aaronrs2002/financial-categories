
let findHeight = 100;
let theLabels = [];

const width = window.innerWidth;
let legendWidth = 500;

if (width < 768) {
    findHeight = 250;
    legendWidth = 435;
} else {
    findHeight = 100;

}

let currentChartData = {
    series: [],
    labels: theLabels,
    chart: {
        type: 'donut',
        total: 0,
        dataLabels: {
            enabled: true,
        },


        chart: {
            width: '100%',
        },
        legend: {
            show: true,
            showForSingleSeries: false,
            showForNullSeries: true,
            showForZeroSeries: true,
            position: 'bottom',
            horizontalAlign: 'left',
            floating: false,
            formatter: undefined,
            inverseOrder: false,
            width: legendWidth,
            height: findHeight,
            tooltipHoverFormatter: undefined,
            customLegendItems: [],
            offsetX: 15,
            offsetY: 0,
            labels: {
                colors: undefined,
                useSeriesColors: false
            },
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 12,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
            },
            itemMargin: {
                horizontal: 2,
                vertical: 0
            },
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
        },
        labels: theLabels,
        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'bottom'
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300,
                    horizontalAlign: 'left',
                    offsetX: 0,
                    offsetY: 0,

                },
                legend: {
                    width: 300,
                    position: 'bottom',
                    horizontalAlign: 'left',
                    offsetX: 0,
                    offsetY: 0,
                }
            }
        }],
        plotOptions: {
            pie: {
                customScale: 1,
                labels: true
            }
        }

    }
};



//end chart
let categories = [];
let amountList = [];

if (localStorage.getItem("amountList")) {
    amountList = JSON.parse(localStorage.getItem("amountList"));
}


function fillCategoryField() {

    let whichCategory = document.querySelector("select[name='availableCategories']").value;
    if (whichCategory === "default") {
        return false;
    }
    document.querySelector("input[name='amountCategory']").value = whichCategory;
}


function buildAvailableCategories(categories) {


    theLabels = [];
    currentChartData.series = [];
    let categoryObj = [];

    let availableCategoriesHTML = "<option value='default'>Select category</option>";
    for (let i = 0; i < categories.length; i++) {
        if (i === 0) {
            document.querySelector("select[name='availableCategories']").classList.remove("hide");
        }
        availableCategoriesHTML = availableCategoriesHTML + "<option value='" + categories[i] + "'>" + categories[i] + "</option>";
        categoryObj.push({
            categoryName: categories[i],
            categoryTotal: 0
        })
    }

    for (let i = 0; i < amountList.length; i++) {
        for (let j = 0; j < categoryObj.length; j++) {
            if (amountList[i].category === categoryObj[j].categoryName) {
                categoryObj[j].categoryTotal = categoryObj[j].categoryTotal + Number(amountList[i].amount);
            }
        }
    }
    console.log("JSON.stingify(categoryObj): " + JSON.stringify(categoryObj));
    document.querySelector("select[name='availableCategories']").innerHTML = availableCategoriesHTML;

    for (let i = 0; i < categoryObj.length; i++) {
        currentChartData.series.push(categoryObj[i].categoryTotal)
        theLabels.push(categoryObj[i].categoryName)
    }
    currentChartData.labels = theLabels;

    setTimeout(() => {
        //  console.log("JSON.stringify(currentChartData): " + JSON.stringify(currentChartData));
        document.querySelector("#chart").innerHTML = "";
        var chart = new ApexCharts(document.querySelector("#chart"), currentChartData);
        chart.render();
    }, 1000);

}
function buildTotal() {

    if (localStorage.getItem("amountList")) {
        amountList = JSON.parse(localStorage.getItem("amountList"));
    }
    else {
        amountList = [];
    }
    console.log("JSON.stringify(amountList)" + JSON.stringify(amountList));

    let amountTotal = 0;
    let amountCategoriesListTargetHTML = "";

    categories = [];

    for (let i = 0; i < amountList.length; i++) {
        amountTotal = amountTotal + Number(amountList[i].amount);
        console.log("JSON.stringify(amountList)" + JSON.stringify(amountList));
        console.log("categories: " + categories);
        if (categories.indexOf(amountList[i].category) === -1) {
            categories.push(amountList[i].category);
            console.log("We are building category HTML");



        }




    }

    buildAvailableCategories(categories);/*for select men--*/

    for (let j = 0; j < categories.length; j++) {
        if (!document.getElementById(categories + "amounts")) {
            amountCategoriesListTargetHTML = amountCategoriesListTargetHTML + `<li class="list-group-item list-group-item-action list-group-item-success">
                    <label>${categories[j]}: $<span data-${categories[j].replaceAll(" ", "-")}total="0">0</span> total</label><ul class="list-group" id="${categories[j].replaceAll(" ", "-")}amounts"></ul></li>`;
        }

    }

    console.log("categories2: " + categories);


    document.getElementById("amountCategoriesListTarget").innerHTML = amountCategoriesListTargetHTML;






    document.querySelector("#amountTotalTarget").innerHTML = "$" + amountTotal;

    //span data-category="${categories[j]}-total"


    for (let i = 0; i < amountList.length; i++) {
        for (let j = 0; j < categories.length; j++) {
            amountListHTML = document.getElementById(categories[j].replaceAll(" ", "-") + "amounts").innerHTML;
            if (categories[j] === amountList[i].category) {


                amountListHTML = amountListHTML + `<li class="list-group-item list-group-item-action list-group-item-info"><i class="fas fa-trash cursor-pointer"onClick="deleteListItem(${i})"></i>$${amountList[i].amount}:${amountList[i].name.replaceAll(" ", "-")}: <span data-${amountList[i].name.replaceAll(" ", "-")}percent></span></li>`;
                document.getElementById(amountList[i].category.replaceAll(" ", "-") + "amounts").innerHTML = amountListHTML;
                currentCategoryTotal = document.querySelector(`span[data-${categories[j].replaceAll(" ", "-")}total]`).innerHTML;
                console.log("currentCategoryTotal: " + currentCategoryTotal);
                let itemPercent = 0;

                if (currentCategoryTotal !== 'undefined') {

                    currentCategoryTotal = Number(currentCategoryTotal) + Number(amountList[i].amount);
                    itemPercent = Number(currentCategoryTotal) + Number(amountList[i].amount);
                    document.querySelector(`span[data-${categories[j].replaceAll(" ", "-")}total]`).value = currentCategoryTotal;
                    document.querySelector(`span[data-${categories[j].replaceAll(" ", "-")}total]`).innerHTML = currentCategoryTotal;

                }


            }


        }

    }



    setTimeout(() => {
        for (let i = 0; i < amountList.length; i++) {

            console.log(`document.querySelector("span[data-" + amountList[i].category + "total]").innerHTML: ` + document.querySelector("span[data-" + amountList[i].category.replaceAll(" ", "-") + "total]").innerHTML);
            let categoryTotal = document.querySelector("span[data-" + amountList[i].category.replaceAll(" ", "-") + "total]").innerHTML




            try {

                if (amountList[i].name.replaceAll(" ", " - ") !== 'undefined') {
                    console.log("amountList[i].name.replaceAll() : " + amountList[i].name.replaceAll(" ", "-"));
                    console.log(`"span[data-${amountList[i].name.replaceAll(' ', '-')}percent].  length:"` + document.querySelector("span[data-" + amountList[i].name.replaceAll(' ', '-') + "percent]").length);

                    document.querySelector("span[data-" + amountList[i].name.replaceAll(' ', '-') + "percent]").innerHTML = " " + ((Number(amountList[i].amount) / Number(categoryTotal)) * 100).toString().substring(0, ((Number(amountList[i].amount) / Number(categoryTotal)) * 100).toString().indexOf(".") + 4) + "%";
                }
            } catch (error) {
                console.log("name: " + error);
            }

        }

    }, 1000)









}

function addamount() {

    [].forEach.call(document.querySelectorAll(".error"), (e) => {
        e.classList.remove("error");
    });

    let validateFieldsList = ['amountName', "amountAmount", "amountCategory"];

    for (let i = 0; i < validateFieldsList.length; i++) {
        let ckField = document.querySelector("input[name='" + validateFieldsList[i] + "']").value;
        if (!document.querySelector("input[name='" + validateFieldsList[i] + "']").value) {
            document.querySelector("input[name='" + validateFieldsList[i] + "']").classList.add("error");
            return false;
        }
    }



    let amountName = document.querySelector("input[name='amountName']").value;
    let amountAmount = document.querySelector("input[name='amountAmount']").value;
    let amountCategory = document.querySelector("input[name='amountCategory']").value;

    console.log("amountList: " + amountList)



    if (!amountList) {
        amountList = [];
    }
    amountList.push({ name: amountName, amount: amountAmount, category: amountCategory });

    document.querySelector("input[name='amountName']").value = "";
    document.querySelector("input[name='amountAmount']").value = "";
    document.querySelector("input[name='amountCategory']").value = "";
    localStorage.setItem("amountList", JSON.stringify(amountList));

    buildTotal();

}



function deleteListItem(itemNumber) {
    tempamountList = []
    for (let i = 0; i < amountList.length; i++) {
        if (i !== itemNumber) {
            tempamountList.push(amountList[i]);
        }
    }

    amountList = tempamountList;
    localStorage.setItem("amountList", JSON.stringify(amountList));

    buildTotal();

}



function clearData() {

    categories = [];
    amountList = [];
    amountList = localStorage.removeItem("amountList");
    document.getElementById("chart").innerHTML = "";
    document.getElementById("amountCategoriesListTarget").innerHTML = "";
    document.querySelector("select[name='availableCategories']").innerHTML = "";
    document.querySelector("select[name='availableCategories']").classList.add("hide");
    document.getElementById("amountTotalTarget").innerHTML = "";
    globalAlert("alert-warning", "No Data");
    toggle("clearBt");

    return false;

}

buildTotal();


/*START DOWNLOAD JS*********************************************************/


function downloadData() {
    let tempData = [];
    if (localStorage.getItem("amountList")) {
        tempData = JSON.parse(localStorage.getItem("amountList"));
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(tempData, null, 2)], {
        type: 'application/json'
    }));
    a.setAttribute("download", "financial-categories.json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


//START FILE READER
const fileReader = new FileReader();
let file;
function handleOnChange(event) {
    if (event.target.files[0]) {
        file = event.target.files[0];
        console.log("event.target.files[0]: " + JSON.stringify(event.target.files[0]));
        document.querySelector("#fileUpload").classList.remove("hide");
        document.querySelector("#fileMerge").classList.remove("hide");
        globalAlert("alert-warning", `File selected. Select if you want to merge  with current data or not.`);
    } else {
        document.querySelector("#fileUpload").classList.add("hide");
        document.querySelector("#fileMerge").classList.add("hide");
    }
};
function handleOnSubmit(event, type, merge) {
    event.preventDefault();

    if (file) {
        fileReader.onload = function (event) {
            const tempObj = event.target.result;
            if (type === "json") {

                console.log("(typeof tempObj): " + (typeof tempObj) + " - JSON.stringify(tempObj): " + JSON.stringify(tempObj))

                if (merge === "default") {
                    // localStorage.setItem("customDictionary", tempObj);    
                    localStorage.setItem("amountList", tempObj);
                    // loadList();
                    buildTotal();

                } else {
                    let tempItems = [...JSON.parse(localStorage.getItem("financial-categories")), ...JSON.parse(tempObj)];


                    localStorage.setItem("amountList", JSON.stringify(tempItems));

                    //loadList();
                    buildTotal();


                }
            }
            else {
                console.log("That wasn't json.")
            }
        };
        fileReader.readAsText(file);
    }
    document.querySelector("input[type='file']").value = "";
    document.querySelector("#fileUpload").classList.add("hide");
    document.querySelector("#fileMerge").classList.add("hide");
    //toggleEdit();

    globalAlert("alert-success", "Your file was uploaded. The next word should be one you uploaded.");
};


