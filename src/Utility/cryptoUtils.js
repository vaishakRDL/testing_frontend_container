// src/cryptoUtils.js

// Function to generate an encryption key
export async function generateKey() {
    return window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// Function to encrypt a URL
export async function encryptURL(url, key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(url);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector

    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        data
    );

    // Combine iv and encrypted data
    const buffer = new Uint8Array(iv.byteLength + encrypted.byteLength);
    buffer.set(iv, 0);
    buffer.set(new Uint8Array(encrypted), iv.byteLength);

    return buffer;
}

// Function to convert the encrypted buffer to Base64 for easier handling in URLs
export function bufferToBase64(buffer) {
    return btoa(String.fromCharCode.apply(null, buffer));
}

// Function to convert Base64 to buffer
export function base64ToBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        buffer[i] = binaryString.charCodeAt(i);
    }
    return buffer;
}
