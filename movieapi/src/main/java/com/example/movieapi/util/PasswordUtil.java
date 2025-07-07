package com.example.movieapi.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.regex.Pattern;

public class PasswordUtil {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    
    // Password validation regex
    private static final String PASSWORD_PATTERN = 
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";
    
    public static String encryptPassword(String password) {
        return encoder.encode(password);
    }
    
    public static boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
    
    public static boolean isStrongPassword(String password) {
        return Pattern.matches(PASSWORD_PATTERN, password);
    }
    
    public static String getPasswordStrengthMessage(String password) {
        if (password == null || password.isEmpty()) {
            return "Password cannot be empty";
        }
        if (password.length() < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!Pattern.compile("[0-9]").matcher(password).find()) {
            return "Password must contain at least one digit";
        }
        if (!Pattern.compile("[a-z]").matcher(password).find()) {
            return "Password must contain at least one lowercase letter";
        }
        if (!Pattern.compile("[A-Z]").matcher(password).find()) {
            return "Password must contain at least one uppercase letter";
        }
        if (!Pattern.compile("[@#$%^&+=!]").matcher(password).find()) {
            return "Password must contain at least one special character (@#$%^&+=!)";
        }
        return "Strong password";
    }
} 