/**
 * SAFE Federal Credit Union - Login Page JavaScript
 * Handles form validation, authentication, and UI interactions
 */

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const userIdInput = document.getElementById('userId');
    const passwordInput = document.getElementById('password');
    const userIdWrapper = document.getElementById('userIdWrapper');
    const passwordWrapper = document.getElementById('passwordWrapper');
    const userIdError = document.getElementById('userIdError');
    const passwordError = document.getElementById('passwordError');
    const loginButton = document.getElementById('loginButton');
    const buttonText = loginButton.querySelector('.button-text');
    const buttonLoader = loginButton.querySelector('.button-loader');
    const formMessage = document.getElementById('formMessage');
    const togglePassword = document.getElementById('togglePassword');
    const eyeIcon = togglePassword.querySelector('.eye-icon');
    const saveUserIdCheckbox = document.getElementById('saveUserId');

    // Initialize
    init();

    function init() {
        // Load saved User ID if exists
        const savedUserId = localStorage.getItem('safefed_userId');
        if (savedUserId) {
            userIdInput.value = savedUserId;
            saveUserIdCheckbox.checked = true;
        }

        // Check initial button state
        updateButtonState();

        // Event Listeners
        userIdInput.addEventListener('input', handleInputChange);
        passwordInput.addEventListener('input', handleInputChange);
        loginForm.addEventListener('submit', handleSubmit);
        togglePassword.addEventListener('click', togglePasswordVisibility);
        saveUserIdCheckbox.addEventListener('change', handleSaveUserIdChange);

        // Enter key to submit
        passwordInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    function handleInputChange() {
        clearErrors();
        updateButtonState();
    }

    function updateButtonState() {
        const hasUserId = userIdInput.value.trim().length > 0;
        const hasPassword = passwordInput.value.length > 0;

        if (hasUserId && hasPassword) {
            loginButton.disabled = false;
        } else {
            loginButton.disabled = true;
        }
    }

    function clearErrors() {
        userIdWrapper.classList.remove('error');
        passwordWrapper.classList.remove('error');
        userIdError.textContent = '';
        passwordError.textContent = '';
        formMessage.classList.add('hidden');
        formMessage.classList.remove('success', 'error');
    }

    function showError(element, wrapper, message) {
        element.textContent = message;
        wrapper.classList.add('error');
    }

    function validateForm() {
        let isValid = true;
        clearErrors();

        // Validate User ID
        const userId = userIdInput.value.trim();
        if (!userId) {
            showError(userIdError, userIdWrapper, 'User ID is required');
            isValid = false;
        } else if (userId.length < 3) {
            showError(userIdError, userIdWrapper, 'User ID must be at least 3 characters');
            isValid = false;
        }

        // Validate Password
        const password = passwordInput.value;
        if (!password) {
            showError(passwordError, passwordWrapper, 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordError, passwordWrapper, 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Simulate API call
            await simulateLogin(userIdInput.value.trim(), passwordInput.value);

            // Save User ID if checkbox is checked
            if (saveUserIdCheckbox.checked) {
                localStorage.setItem('safefed_userId', userIdInput.value.trim());
            } else {
                localStorage.removeItem('safefed_userId');
            }

            // Show success message
            showFormMessage('Login successful! Redirecting...', 'success');

            // Simulate redirect after 2 seconds
            setTimeout(() => {
                // In production, this would redirect to the dashboard
                // window.location.href = '/dashboard';
                alert('Login successful! In production, you would be redirected to your dashboard.');
            }, 2000);

        } catch (error) {
            showFormMessage(error.message, 'error');
        } finally {
            setLoadingState(false);
        }
    }

    function simulateLogin(userId, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulated authentication
                // In production, this would be an API call
                if (userId === 'user123' && password === 'password123') {
                    resolve({ success: true });
                } else {
                    reject(new Error('Invalid User ID or Password'));
                }
            }, 1500);
        });
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            loginButton.disabled = true;
            buttonText.textContent = 'Logging in...';
            buttonLoader.classList.remove('hidden');
        } else {
            updateButtonState();
            buttonText.textContent = 'Login';
            buttonLoader.classList.add('hidden');
        }
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.classList.remove('hidden', 'success', 'error');
        formMessage.classList.add(type);
    }

    function togglePasswordVisibility() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        eyeIcon.classList.toggle('hidden-icon', !isPassword);
    }

    function handleSaveUserIdChange() {
        if (!saveUserIdCheckbox.checked) {
            localStorage.removeItem('safefed_userId');
        }
    }
});
