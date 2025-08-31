// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navMenu = document.getElementById("navMenu")

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      mobileMenuBtn.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      mobileMenuBtn.classList.remove("active")
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
      navMenu.classList.remove("active")
      mobileMenuBtn.classList.remove("active")
    }
  })

  // Project filtering functionality
  const filterButtons = document.querySelectorAll(".filter-btn")
  const projectCards = document.querySelectorAll(".project-card")

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"))
        // Add active class to clicked button
        button.classList.add("active")

        const filter = button.getAttribute("data-filter")

        projectCards.forEach((card) => {
          if (filter === "all") {
            card.style.display = "block"
          } else {
            const category = card.getAttribute("data-category")
            if (category === filter) {
              card.style.display = "block"
            } else {
              card.style.display = "none"
            }
          }
        })
      })
    })
  }

  // Contact Form Submission
  const contactForm = document.getElementById("contactForm")
  const submitBtn = document.getElementById("submitBtn")
  const submitText = submitBtn.querySelector(".submit-text")
  const submitIcon = submitBtn.querySelector(".submit-icon")

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Set loading state
      submitBtn.disabled = true
      submitBtn.classList.add("loading")
      submitText.textContent = "Sending..."

      // Get form data
      const formData = new FormData(contactForm)
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        involvement: formData.get("involvement"),
        message: formData.get("message"),
      }

      try {
        // Simulate API call (replace with actual endpoint)
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          showToast("Message sent successfully!", "We'll get back to you within 24-48 hours.", "success")
          contactForm.reset()
        } else {
          throw new Error("Failed to send message")
        }
      } catch (error) {
        console.log("[v0] Contact form submission failed:", error)
        showToast("Error sending message", "Please try again or contact us directly via email.", "error")
      } finally {
        // Reset button state
        submitBtn.disabled = false
        submitBtn.classList.remove("loading")
        submitText.textContent = "Send Message"
      }
    })
  }

  const pageTransitionOverlay = document.getElementById("pageTransitionOverlay")

  // Handle page transitions for navigation links
  const allNavLinks = document.querySelectorAll(".nav-link, .btn[href], .footer-link")

  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href")

      // Only handle internal links (not external or anchor links)
      if (href && !href.startsWith("#") && !href.startsWith("http") && !href.startsWith("mailto")) {
        e.preventDefault()

        // Show transition overlay
        pageTransitionOverlay.classList.add("active")
        document.body.classList.add("page-transitioning")

        // Navigate after animation
        setTimeout(() => {
          window.location.href = href
        }, 500)
      }
    })
  })

  // Hide transition overlay on page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      pageTransitionOverlay.classList.remove("active")
      document.body.classList.remove("page-transitioning")
    }, 300)
  })

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe background image sections
  const backgroundSections = document.querySelectorAll(".background-image-section, .mission-card, .project-card")
  backgroundSections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(30px)"
    section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"
    observer.observe(section)
  })
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add scroll effect to navbar
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(254, 252, 247, 0.98)"
  } else {
    navbar.style.background = "rgba(254, 252, 247, 0.95)"
  }
})

// Toast notification function
function showToast(title, description, type = "success") {
  const toast = document.getElementById("toast")
  const toastIcon = document.getElementById("toastIcon")
  const toastTitle = document.getElementById("toastTitle")
  const toastDescription = document.getElementById("toastDescription")

  // Set content
  toastTitle.textContent = title
  toastDescription.textContent = description

  // Set icon based on type
  if (type === "success") {
    toastIcon.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    `
    toastIcon.className = "toast-icon success"
    toast.className = "toast success"
  } else {
    toastIcon.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `
    toastIcon.className = "toast-icon error"
    toast.className = "toast error"
  }

  // Show toast
  toast.classList.add("show")

  // Hide after 5 seconds
  setTimeout(() => {
    toast.classList.remove("show")
  }, 5000)
}



