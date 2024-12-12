
export function isResponseOk(response) {
  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  } else {
    throw Error(response.statusText);
  }
}

export function getCSRF(setState) {
  fetch("/backend/csrf/", {
    credentials: "same-origin",
  })
  .then((res) => {
    let csrfToken = res.headers.get("X-CSRFToken");
    setState(prevState => ({ ...prevState, csrf: csrfToken }));
    console.log(csrfToken);
  })
  .catch((err) => {
    console.log(err);
  });
}

export function whoami() {
  fetch("/backend/whoami/", {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  })
  .then((res) =>res.json()
    )
  .then((data) => {
    console.log("You are logged in as: " + data.username);
  })
  .catch((err) => {
    console.log(err);
  });
}

