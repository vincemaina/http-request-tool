import Head from 'next/head'

let method = "GET"

function changeMethod(elem) {
    if (elem.target.checked === true) {
        document.getElementById("input-message").parentElement.hidden = elem.target.value === "GET"
        method = elem.target.value === "GET" ? "GET" : "POST"
    }
}

function sendRequest() {

    let responseOutcome = document.getElementById("response-outcome")
    let responseDisplay = document.getElementById("response-display")

    let endpoint = document.getElementById("input-endpoint")
    if (!endpoint.checkValidity()) {
        alert("Please enter a valid endpoint url")
        endpoint.focus()
        return
    }

    responseOutcome.innerHTML = "<span style='color: orange'>Waiting for response...</span>"
    responseDisplay.innerText = ""

    let data = {
        method: method
    }

    if (method === "POST") {
        data["body"] = {"message": document.getElementById("input-message").value}
    }

    fetch(
        endpoint.value, data
    )
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
            responseOutcome.innerHTML = "<span style='color: green'>Success!</span>"
            responseDisplay.innerText = JSON.stringify(data, null, 4)
        })
        .catch((error) => {
            console.error("Error:", error);
            responseOutcome.innerHTML = "<span style='color: red'>Invalid request!</span>"
        });

}

export default function Home() {
    return (
        <>
            <Head>
                <title>HTTP Request Tool</title>
                <meta name="description" content="HTTP request sender for testing."/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={"text-white"} style={{background: "midnightblue"}}>
                <div className="text-center">
                    <div className="row vh-100 align-items-start">

                        {/* Inputs */}
                        <div className="col-lg-5 text-start p-5">
                            <h1 className={"fw-bold"}>HTTP Tool</h1>
                            <p className={"fw-light fs-3 mb-3"}>Testing tool for sending HTTP requests from a Next.js server.</p>

                            <hr className="border border border-1 opacity-100 mb-4" />

                            {/* Method radio buttons */}
                            <div className={"text-start mb-4"}>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="flexRadioDefault"
                                           id="flexRadioDefault1" value={"GET"} onClick={changeMethod} checked/>
                                    <label className="form-check-label" htmlFor="flexRadioDefault1">GET</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="flexRadioDefault"
                                           id="flexRadioDefault2" value={"POST"} onClick={changeMethod} />
                                    <label className="form-check-label" htmlFor="flexRadioDefault2">POST</label>
                                </div>
                            </div>

                            {/* Endpoint input */}
                            <div className={"text-start mb-3"}>
                                <label htmlFor={"input-endpoint"}>Endpoint URL <span style={{opacity: "0.5"}}>(change me!)</span></label>
                                <input type={"url"} id={"input-endpoint"} className={"form-control"}
                                       placeholder={"e.g. https://httpbin.org/ip"} defaultValue={"https://www.boredapi.com/api/activity"} required/>
                            </div>

                            {/* Message input */}
                            <div className={"text-start mb-4"} hidden>
                                <label htmlFor={"input-message"}>Message</label>
                                <input type={"text"} id={"input-message"} className={"form-control"}
                                       placeholder={"e.g. Sent from Next.js"}/>
                            </div>

                            {/* Submit button */}
                            <div className={"text-start mt-4"}>
                                <button type={"button"} className={"btn btn-lg btn-success"} onClick={sendRequest}>Send</button>
                            </div>
                        </div>

                        {/* Response */}
                        <div className="col-lg h-100 w-100">
                            <div className={"h-100 w-100 p-5 text-start text-white"} style={{backgroundColor: "black", overflowY: "scroll"}}>
                                <div id={"response-outcome"}>Use the left panel to send a request</div>
                                <br/>
                                <div id={"response-display"}></div>
                            </div>

                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}
