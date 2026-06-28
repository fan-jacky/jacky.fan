'use client'
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useContext, useRef, useState } from "react";
import { AlertContext } from "@/contexts/AlertContext";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export default function ContactForm() {

    const inputName = useRef<HTMLInputElement>(null)
    const inputEmail = useRef<HTMLInputElement>(null)
    const inputMessage = useRef<HTMLTextAreaElement>(null)
    const { setAlert } = useContext(AlertContext);
    const { executeRecaptcha } = useGoogleReCaptcha()

    const [isLoading, setIsLoading] = useState(false);
    const [showRequired, setShowRequired] = useState({ name: false, email: false, message: false });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const name = inputName.current?.value.trim();
        const email = inputEmail.current?.value.trim();
        const message = inputMessage.current?.value.trim();
        
        const hasErrors = !name || !email || !message;
        setShowRequired({ 
            name: !name, 
            email: !email, 
            message: !message 
        });
        
        if (hasErrors) return;
        
        try {
            setIsLoading(true);
            
            // Execute reCAPTCHA
            if (!executeRecaptcha) {
                throw new Error('reCAPTCHA is not initialized');
            }
            const token = await executeRecaptcha('contact_form');
            
            // Send to backend API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message, token })
            });
            
            if (!response.ok) throw new Error('Failed to send message');
            
            setAlert?.({
                show: true,
                message: 'Message sent successfully! I\'ll get back to you soon.',
                type: 'success'
            });
            
            inputName.current && (inputName.current.value = '');
            inputEmail.current && (inputEmail.current.value = '');
            inputMessage.current && (inputMessage.current.value = '');
        } catch (error) {
            setAlert?.({
                show: true,
                message: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="contact-form">

            <div className="contact-form__field contact-form__field--compact">
                <label htmlFor="contactName" className="contact-form__label">
                    <span className="contact-form__label-text">What is your name?</span>
                </label>
                <input id="contactName" type="text" placeholder="Type your name here" className="contact-form__input" ref={inputName} />
                {showRequired.name &&
                    <p className="contact-form__error">This field is required.</p>
                }
            </div>

            <div className="contact-form__field contact-form__field--compact">
                <label htmlFor="contactEmail" className="contact-form__label">
                    <span className="contact-form__label-text">What is your Email?</span>
                </label>
                <input id="contactEmail" type="email" placeholder="Type your email here" className="contact-form__input" ref={inputEmail} />
                {showRequired.email &&
                    <p className="contact-form__error">This field is required.</p>
                }
            </div>

            <div className="contact-form__field">
                <label htmlFor="contactMessage" className="contact-form__label">
                    <span className="contact-form__label-text">What is your message?</span>
                </label>
                <textarea id="contactMessage" className="contact-form__textarea" placeholder="Type your message here" ref={inputMessage} name="body"></textarea>
                {showRequired.message &&
                    <p className="contact-form__error">This field is required.</p>
                }
            </div>

            <button type="submit" className="btn btn-primary contact-form__submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Submit'}
                <PaperAirplaneIcon className="contact-form__submit-icon" />
            </button>

        </form>
    );
}