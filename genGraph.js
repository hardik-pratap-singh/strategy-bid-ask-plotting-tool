function getAllData() {
    let detailsArr = []
    for (let i = 0; i < 10; i++) {
        //Getting each strategy
        // let strategy = document.querySelector(`.strategy-${i+1}`)
        let strategydetails = []
        for (let j = 0; j < 6; j++) {
            //Here I will get each ID and multiplier for the same 
            let ID = document.querySelector(`.strategy-${i + 1}-ID-${j + 1} input`)
            let mul = document.querySelector(`.strategy-${i + 1}-M-${j + 1} input`)

            // let finalmul = "" ; 
            // if(mul.value !== null){
            //     let mulval = mul.value ; 
            //     if(mulval[0] === '-'){
            //         finalmul = mulval ; 
            //     }
            //     else{
            //         finalmul = "+" + mulval ; 
            //     }
            // }
            // console.log("ID " , ID.value  , " mul " , mul.value)
            
            strategydetails.push([ID.value ? ID.value : null, mul.value ? finalmul : null])
            // console.log()
        }
        detailsArr.push(strategydetails)
    }
    return detailsArr;
}

function getStrategicalData(strategy) {
    
    let strategydetails = []
    for (let j = 0; j < 6; j++) {
        let ID = document.querySelector(`.strategy-${strategy}-ID-${j + 1} form select`)
        let mul = document.querySelector(`.strategy-${strategy}-M-${j + 1} input`)
        let product = document.querySelector(`.strategy-${strategy}-ID-${j + 1} form input`)
        // console.log(ID.value)
        // console.log("mul " , mul.value)
        // console.log(ID) ; 
        // console.log(mul)

        if(ID && mul.value){
            let mulval = mul.value ; 
            let pr = product.value 
            const selectedOption = ID.options[ID.selectedIndex];
            const contract = selectedOption.text;
            // let allContracts = 
            if(mulval[0] === '-'){
                strategydetails.push([ strategy , j + 1 , pr , contract , ID.value, mul.value])
            }
            else{
                let finalmul = "+" + mulval ; 
                console.log("Final mul  " , finalmul)
                strategydetails.push([ strategy , j + 1 , pr , contract , ID.value, finalmul])
            }
        }


        // strategydetails.push([ID ? ID.value : null, mul ? mul.value : null])
    }
   
    return strategydetails
}

function genGraph(strategy) {
    // alert("Proceed To generate graph")
    // First arrange all the entries in their strategy form along with instrumentID's and multipliers 
    let strategydetails = getStrategicalData(strategy);
    window.localStorage.setItem(`details-${strategy}`, JSON.stringify(strategydetails))
    // window.localStorage.setItem("details", JSON.stringify(strategydetails))
    // window.localStorage.setItem("ID", "hardik")
    // console.log(strategydetails)
    Swal.fire({
        title: "Done !",
        text: `We are generating your graph for strategy - ${strategy} !`,
        icon: "success"
    })
    .then((result) => {
        
        // window.localStorage.setItem("ID", "hardik")
        // window.location.href = `http://localhost:5501/new.html?s=${strategy}`
        let strategyname = document.querySelector(`.strategy-${strategy} th input`)
        // console.log("strategyname " , strategyname)
        let URL ; 
        if(strategyname.value === ''){
            URL = `./new.html?s=${strategy}`; 
        }
        else{
            URL = `./new.html?s=${strategy}&sname=${strategyname.value}`; 
        }
        // console.log(strategyname)
        // // let URL = `http://localhost:5501/new.html?s=${strategy}`; 
        // let 
        window.open(URL , '_blank')
        // window.localStorage.setItem("ID", 4567)
    })
    // .then(() => {
    // })
    .catch((err) => {
        console.log(err)
    });
}
