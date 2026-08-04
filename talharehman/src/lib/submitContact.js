// Submission endpoint: formsubmit.co, configured via the contact <form>'s own `action`
// attribute (src/components/sections/Contact.jsx) — no server, no API keys required, and it
// already works against the real inbox. To swap in a custom backend later, change that
// form's `action` (or point this function at a different URL) — the POST/FormData contract
// below doesn't need to change either way.
export async function submitContact(formElement) {
  const response = await fetch(formElement.action, {
    method: 'POST',
    body: new FormData(formElement),
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Contact form submission failed: ${response.status}`)
  }
}
