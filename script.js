/* ============================================================
   MAILERLITE SETUP: paste your form's address between the quotes.
   It looks like:
   https://assets.mailerlite.com/jsonp/123456/forms/987654321/subscribe
   (See README.md, "Connect MailerLite")
   ============================================================ */
const MAILERLITE_FORM_URL = "";

const form = document.getElementById("signup-form");
const message = document.getElementById("form-message");
const button = document.getElementById("submit-btn");

function show(text, type) {
  message.textContent = text;
  message.className = "message " + type;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = form.elements["fields[email]"];

  if (!email.value.trim() || !email.checkValidity()) {
    show("Please enter a valid email address.", "error");
    email.focus();
    return;
  }
  if (!form.elements["consent"].checked) {
    show("Please tick the box to agree to receive emails.", "error");
    form.elements["consent"].focus();
    return;
  }
  if (!MAILERLITE_FORM_URL) {
    show("Signup isn't connected yet. Add the MailerLite form address in script.js.", "error");
    return;
  }

  button.disabled = true;
  show("Joining…", "success");

  try {
    const data = new FormData(form);
    data.delete("consent");
    const response = await fetch(MAILERLITE_FORM_URL, { method: "POST", body: data });
    const result = await response.json();

    if (response.ok && result.success) {
      form.reset();
      show("You're on the list. Check your inbox if we've asked you to confirm your email.", "success");
    } else {
      const detail = result.errors && Object.values(result.errors).flat()[0];
      show(detail || "We couldn't add your email. Please check it and try again.", "error");
    }
  } catch (err) {
    show("Something went wrong connecting to the list. Please try again in a moment.", "error");
  } finally {
    button.disabled = false;
  }
});
