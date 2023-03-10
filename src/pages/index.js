import Head from 'next/head'
import { Roboto_Mono, Roboto } from 'next/font/google'

const robotoMono = Roboto_Mono ({
    weight: '400',
    subsets: ['latin'],
})

const roboto = Roboto({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
})

let method = "GET"

function randomAPIPicker() {
    let APIs = [
        "https://official-joke-api.appspot.com/random_joke",
        "https://www.boredapi.com/api/activity",
        "https://api.publicapis.org/entries"
    ]

    return APIs[Math.floor(Math.random() * APIs.length)]
}

function changeMethod(elem) {
    if (elem.target.checked === true) {
        document.getElementById("input-body").parentElement.hidden = elem.target.value === "GET"
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

    let data = {
        method: method
    }

    let rawPayload = document.getElementById("input-body").value.trim()
    if (method === "POST" && rawPayload) {

        let payload = {}

        let keyValPairs = rawPayload.split(";")

        for (const pair of keyValPairs) {
            if (pair.trim()) {
                let keyVal = pair.split(":")
                payload[keyVal[0].trim()] = keyVal[1].trim();
            }
        }

        data["body"] = JSON.stringify(payload)
    }

    responseOutcome.innerHTML = "<span style='color: orange'>Waiting for response...</span>"
    responseDisplay.innerText = ""

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
            <main className={"text-white"} style={{background: "linear-gradient(130deg, midnightblue, violet)"}}>
                <div className="text-center">
                    <div className="row vh-100 align-items-start">

                        {/* Inputs */}
                        <div className={"col-lg-5 text-start p-5 " + roboto.className}>
                            <h1 className={"fw-bold"} style={{color: "pink"}}>HTTP Tool</h1>
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
                                       placeholder={"e.g. https://httpbin.org/ip"} defaultValue={randomAPIPicker()} required/>
                            </div>

                            {/* Message input */}
                            <div className={"text-start mb-4"} hidden>
                                <label htmlFor={"input-body"}>Body</label>
                                <input type={"text"} id={"input-body"} className={"form-control"}
                                       placeholder={"e.g. key1: val1; key2: val2;"}/>
                            </div>

                            {/* Submit button */}
                            <div className={"text-start mt-4"}>
                                <button type={"button"} className={"btn btn-lg btn-warning"} onClick={sendRequest}>Send</button>
                            </div>

                            <div className={"fixed-bottom"}>
                                <span className={"p-2 m-3 bg-light text-black rounded d-inline-block"}>
                                    <i className="icon bi bi-github me-1"></i>
                                    Built by Vince Maina
                                </span>
                            </div>
                        </div>

                        {/* Response */}
                        <div className={"col-lg h-100 w-100 fs-6 " + robotoMono.className}>
                            <div className={"h-100 w-100 p-5 text-start text-white"} style={{backgroundColor: "#0f0f0f",
                                overflowY: "scroll", boxShadow: "inset black 0px 0px 30px"}}>
                                <div id={"response-outcome"}><span style={{color: "grey"}}>Use the left panel to send a HTTP request to the example API, or enter your own API endpoint!</span></div>
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
