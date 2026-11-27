// Inquiry form for Taiwan with Jady.
// Sends the form to Web3Forms, which emails it to Jady.
// Paste the Access Key from web3forms.com below. The key is meant to be public.
var WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';

(function () {
  var form = document.getElementById('inquiry');
  if (!form) return;

  // The page shows Chinese and English together, so messages do too.
  var text = {
    missing: '請填寫姓名和有效的電子郵件。 Please add your name and a valid email address.',
    sending: '傳送中⋯⋯ Sending...',
    sent: '已收到你的訊息，我會在兩個工作天內回覆，謝謝！ Thank you! I reply within two working days.',
    failed: '訊息沒有送出，請稍後再試，或寫信到 hello@taiwanwithjady.com。 Your message was not sent. Please try again later, or email hello@taiwanwithjady.com.',
    notReady: '表單尚未完成設定，訊息沒有送出。 The form is not set up yet, so nothing was sent.',
    subject: '網站詢問 Website inquiry'
  };

  var status = document.getElementById('status');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('f-name');
    var email = document.getElementById('f-email');

    if (!name.value.trim() || !email.value.trim() || !email.checkValidity()) {
      status.textContent = text.missing;
      (name.value.trim() ? email : name).focus();
      return;
    }
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.indexOf('YOUR_') === 0) {
      status.textContent = text.notReady;
      return;
    }

    var interests = Array.prototype.map.call(
      form.querySelectorAll('input[name="i"]:checked'),
      function (box) { return box.parentNode.textContent.trim(); }
    ).join(', ');

    var payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: text.subject + ': ' + name.value.trim(),
      from_name: 'Taiwan with Jady website',
      name: name.value.trim(),
      email: email.value.trim(),
      trip_type: document.getElementById('f-type').value,
      group_size: document.getElementById('f-size').value,
      travel_dates: document.getElementById('f-when').value,
      interests: interests,
      message: document.getElementById('f-msg').value,
      botcheck: document.getElementById('f-botcheck').checked
    };

    button.disabled = true;
    status.textContent = text.sending;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.success) {
          status.textContent = text.sent;
          form.reset();
        } else {
          status.textContent = text.failed;
        }
      })
      .catch(function () { status.textContent = text.failed; })
      .then(function () { button.disabled = false; });
  });
})();
