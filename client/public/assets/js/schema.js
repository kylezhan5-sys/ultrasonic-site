// Schema.org structured data for SonoTech Ultrasonic
(function() {
  var org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SonoTech Ultrasonic Technology Co., Ltd.",
    "alternateName": "SonoTech Ultrasonic",
    "url": "https://www.sonotech-ultrasonic.com/",
    "logo": "https://www.sonotech-ultrasonic.com/assets/img/logo.png",
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+86-000-0000-0000",
      "contactType": "sales",
      "availableLanguage": ["English", "Spanish", "Arabic"]
    }],
    "sameAs": [],
    "description": "Professional manufacturer of ultrasonic spray coating systems, atomizers, homogenizers, welding machines, transducers, generators, and horns for industrial applications worldwide.",
    "foundingDate": "2014",
    "numberOfEmployees": {"@type": "QuantitativeValue", "value": 50},
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CN"
    }
  };

  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(org);
  document.head.appendChild(script);

  // FAQ Schema for pages with FAQ sections
  var faqSection = document.querySelector('.faq-section');
  if (faqSection) {
    var questions = faqSection.querySelectorAll('.faq-item');
    if (questions.length > 0) {
      var faqItems = [];
      questions.forEach(function(q) {
        var question = q.querySelector('.faq-question');
        var answer = q.querySelector('.faq-answer');
        if (question && answer) {
          faqItems.push({
            "@type": "Question",
            "name": question.textContent.trim(),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answer.textContent.trim()
            }
          });
        }
      });
      if (faqItems.length > 0) {
        var faqScript = document.createElement('script');
        faqScript.type = 'application/ld+json';
        faqScript.text = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems
        });
        document.head.appendChild(faqScript);
      }
    }
  }
})();
