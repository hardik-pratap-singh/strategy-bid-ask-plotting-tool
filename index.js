let thead = Array.from(document.querySelectorAll("thead tr th"))
// console.log(thead)
thead[0].style.textAlign = "center"
for (let i = 1; i < thead.length; i++) {
    if (i % 2 !== 0) {
        // console.log(thead[i])
        let j = Math.floor(i / 2);
        j++;
        thead[i].innerHTML = `&nbsp;&nbsp;&nbsp;Contract ${j}`
    }
    else {
        let j = i / 2;
        thead[i].innerHTML = `&nbsp;Mult ${j}`
    }
};

let table = document.querySelector("#strategy-table tbody");
// let tbody = tabl
// console.log(table);

for (let i = 0; i < 10; i++) {
    // Create a new row
    let tr = document.createElement("tr");
    // Create the first cell with <th>
    tr.classList.add(`strategy-${i + 1}`)
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerHTML = `<input type="text" class="form-control w-100" placeholder='Strategy ${i + 1}' aria-label="Username" aria-describedby="basic-addon1">`; // Set the content of <th>
    // th.style.textAlign = "center"
    tr.appendChild(th);

    for (let j = 0; j < 6; j++) {
        // Create and append ID cell
        let id = document.createElement("td");
        id.classList.add(`strategy-${i + 1}-ID-${j + 1}`);
        id.innerHTML = `<form class="d-flex" role="search" onsubmit="getContracts(event , ${i + 1} , ${j + 1})" >
                            <input type="text" class="form-control w-50" placeholder="Product" aria-label="Username" aria-describedby="basic-addon1">
                            <button class="btn btn-outline-success" type="submit">Go</button>
                        </form>`;
        tr.appendChild(id);

        // Create and append M cell
        let m = document.createElement("td");
        m.classList.add(`strategy-${i + 1}-M-${j + 1}`);
        m.innerHTML = `<input type="text" class="form-control w-75" placeholder="M${j + 1}" aria-label="Username" aria-describedby="basic-addon1">`;
        m.style.width = "5rem"
        tr.appendChild(m);
    }

    let td = document.createElement("td")
    let innerhtml = `<div class="cont">
      <button type="button" onclick="genGraph()" class="btn btn-primary">Generate Strategy Graph</button>
    </div>`
    let button = document.createElement("button");
    button.setAttribute("type", "button")
    button.setAttribute("id", `button-${i + 1}`)
    button.setAttribute("onclick", `genGraph(${i + 1})`)
    button.setAttribute("class", "btn btn-primary")
    button.textContent = "Plot"
    td.appendChild(button)
    tr.appendChild(td)


    // Append the row to the table
    table.appendChild(tr);
}


//filling the cached values present in the localstorage 
//First I will check which strategies are present in the localstorage beforehand 
for (let i = 1; i <= 10; i++) { // this will loop through each and every strategy
    if (window.localStorage.getItem(`details-${i}`)) {
        //since details-${i} is present, that means somebody has already set something related to it
        //and we have all the information related to that
        let details = JSON.parse(window.localStorage.getItem(`details-${i}`))
        console.log(typeof (details))
        console.log(details)
        for (let j = 0; j < details.length; j++) {
            let row = details[j][0];
            let col = details[j][1];
            let product = details[j][2];
            let contract = details[j][3];
            let instrumentID = details[j][4];
            let mult = details[j][5];
            console.log(row)
            console.log(col)
            let form = document.querySelector(`.strategy-${row}-ID-${col} form`)
            let productElement = document.querySelector(`.strategy-${row}-ID-${col} form input`)
            let mul = document.querySelector(`.strategy-${row}-M-${col} input`)
            console.log(productElement)
            productElement.value = product
            // console.log(productElement)
            // let mult = mul.value ; 
            if(mult[0] === '+' && mult[1] === '+'){
                // console.log("ehhllad ")
                
                // console.log(mult)
                let newmul = mult.slice(2)
                console.log("newmul " , newmul)
                mul.value = newmul ; 
            }
            else{
                // console.log("heeerrr")
                mul.value = mult ; 
            }
            // mul.value = mult 
            const select = document.createElement('select');
            console.log(instrumentID)
            select.className = 'form-control'; // Add Bootstrap styling class
            select.innerHTML = `<option value='${instrumentID}'>${contract}</option>`; // Default option
            // select.value = contract
            
            // Populate the dropdown with instrumentAlias values

        
            // Insert the dropdown below the input field
            form.appendChild(select);

        }
    }
}


function getContracts(event, strategy, contract) {
    event.preventDefault();
    // console.log(event)

    // Get the form element from the event
    const form = event.target;

    // Retrieve the input values from the form
    const idInput = form.querySelector('input[type="text"]');
    const idValue = idInput.value;


    //Here get all the contracts for the given product....
    //i.e. we have to make an API call here...

    // console.log("value ", idValue)
    Swal.fire({
        title: "Done !",
        text: `We are fetching contracts for you !`,
        icon: "success"
    })
        .then(async () => {
            try {
                // Construct the API URL with the productCode parameter
                // suppose idValue comes as : 'brn   ' then ? 
                // so we need to trim it from both sides, + convert it to upperCase 
                let trimmed = idValue.trim();
                let finalCode = trimmed.toUpperCase();
                const apiUrl = `https://marketdata-api.corp.hertshtengroup.com/api/instruments/active?productCode=${(finalCode)}`;

                // Make the API call
                const response = await fetch(apiUrl, {
                    // method: 'GET',
                    // headers: {
                    //     'accept': 'text/plain' // Set the accept header to match the curl command
                    // },
                    // mode: 'no-cors'
                });

                // console.log("response", response)

                if (!response.ok) throw new Error('Network response was not ok.');

                // Parse the response text
                const contracts = await response.json();
                // console.log("contracts " , contracts)
                // Display the contracts in an alert or process them as needed
                if (!contracts) {
                    Swal.fire({
                        title: "No Contracts",
                        text: `No contracts found for ID: ${idValue}`,
                        icon: "info"
                    });
                } else {
                    Swal.fire({
                        title: "Contracts Found!",
                        // text: `Contracts for ID ${idValue}: ${contracts}`,
                        text: `Select your contracts for Product ${idValue} from the list`,
                        icon: "success"
                    });


                    const existingDropdown = form.querySelector('select');
                    if (existingDropdown) {
                        existingDropdown.remove();
                    }

                    // Create a new dropdown
                    const select = document.createElement('select');
                    select.className = 'form-control'; // Add Bootstrap styling class
                    select.innerHTML = '<option value="">Select Contract</option>'; // Default option

                    // Populate the dropdown with instrumentAlias values
                    contracts.forEach(contract => {
                        const option = document.createElement('option');
                        option.value = contract.instrumentId; // Option value (can be any unique identifier)
                        option.textContent = contract.instrumentAlias; // Display text
                        select.appendChild(option);
                    });

                    // Insert the dropdown below the input field
                    form.appendChild(select);
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: `Failed to fetch contracts: ${error.message}`,
                    icon: "error"
                });
            }

        })
        .catch((error) => {
            console.log(error)
        })
}