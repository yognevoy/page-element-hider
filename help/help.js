document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Close all other open questions
            document.querySelectorAll('.faq-question.active').forEach(activeQuestion => {
                if (activeQuestion !== question) {
                    activeQuestion.classList.remove('active');
                    const activeAnswer = activeQuestion.nextElementSibling;
                    activeAnswer.classList.remove('active');
                    activeAnswer.style.maxHeight = null;
                }
            });

            // Toggle current question
            if (isActive) {
                question.classList.remove('active');
                answer.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                question.classList.add('active');
                answer.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight;
            }
        });
    });
});
