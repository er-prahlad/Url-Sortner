package com.linkshort.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkshort.feature.auth.dto.LoginRequest;
import com.linkshort.feature.auth.dto.RegisterRequest;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerIT {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    private static String accessToken;
    private static String refreshToken;

    // ── Register ──────────────────────────────────────────────────────────────

    @Test @Order(1)
    void register_returnsTokensAndUser() throws Exception {
        var body = new RegisterRequest("Bob", "bob@example.com", "Password1");

        var result = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("bob@example.com"))
                .andReturn();

        var tree = om.readTree(result.getResponse().getContentAsString());
        accessToken  = tree.at("/data/accessToken").asText();
        refreshToken = tree.at("/data/refreshToken").asText();
    }

    @Test @Order(2)
    void register_duplicateEmail_returns409() throws Exception {
        var body = new RegisterRequest("Bob2", "bob@example.com", "Password1");
        mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test @Order(3)
    void register_invalidEmail_returns400() throws Exception {
        var body = new RegisterRequest("X", "not-an-email", "Password1");
        mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    @Test @Order(4)
    void login_correctCredentials_returnsTokens() throws Exception {
        var body = new LoginRequest("bob@example.com", "Password1");
        mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty());
    }

    @Test @Order(5)
    void login_wrongPassword_returns401() throws Exception {
        var body = new LoginRequest("bob@example.com", "WrongPass1");
        mvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isUnauthorized());
    }

    // ── Me ────────────────────────────────────────────────────────────────────

    @Test @Order(6)
    void me_withValidToken_returnsUser() throws Exception {
        mvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("bob@example.com"));
    }

    @Test @Order(7)
    void me_withoutToken_returns403() throws Exception {
        mvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isForbidden());
    }

    // ── Refresh ───────────────────────────────────────────────────────────────

    @Test @Order(8)
    void refresh_withValidToken_returnsNewAccessToken() throws Exception {
        var body = """
                {"refreshToken":"%s"}""".formatted(refreshToken);
        mvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty());
    }
}
