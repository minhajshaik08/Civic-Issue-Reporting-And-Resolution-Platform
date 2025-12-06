package com.civicreport.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class OtpController {

    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Random random = new Random();

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Phone is required"
            ));
        }

        // Check if this phone is blocked
        String sql = "SELECT 1 FROM blocked_mobiles WHERE mobile = ? LIMIT 1";
        List<Integer> rows = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getInt(1),
                phone
        );

        if (!rows.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Access denied. Your number is blocked by admin."
            ));
        }

        // Not blocked → generate and store OTP
        String otp = String.format("%06d", random.nextInt(1_000_000));
        otpStore.put(phone, otp);
        System.out.println("OTP for " + phone + " is: " + otp);

        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String otp = body.get("otp");
        String stored = otpStore.get(phone);
        boolean valid = stored != null && stored.equals(otp);
        if (valid) otpStore.remove(phone);
        return ResponseEntity.ok(Map.of("valid", valid));
    }
}
