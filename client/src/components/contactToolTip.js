import React ,{useState}from 'react';
import emailIcon from '../icons/mail.png';
import copyIcon from '../icons/copy.png';
import selected from '../icons/select.png'
export default function Contact({ Chef, id }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
     
    }, (err) => {
      alert("Failed to copy: " + err);
    });
  };

  return (
    <div id={id}>
      <div className='contact-info d-flex align-items-center mb-2'>
        <img src={emailIcon} alt="Email" className="contact-icon" />
        <span className='ml-2'>{Chef.email}</span>
        <img 
           src={copied ? selected : copyIcon}
           alt={copied ? "Copied" : "Copy"}
          className="contact-icon copyIcon ms-4" 
          onClick={() => {
            copyToClipboard(Chef.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); 
          }}
        />
      </div>
    
    </div>
  );
}
