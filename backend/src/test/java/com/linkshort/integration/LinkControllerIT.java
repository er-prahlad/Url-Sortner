package com.linkshort.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkshort.feature.auth.dto.RegisterRequest;
import com.linkshort.feature.link.dto.CreateLinkRequest;
import com.linkshort.feature.link.dto.UpdateLinkRequest;
import com.linkshort.domain.entity.Link.LinkStatus;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class LinkControllerIT {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    private static String token;
    private static Long   linkId;

    // ── Setup: register and get token ─────────────────────────────────────────

    @Test @Order(1)
    void setup_registerUser() throws Exception {
        var body = new RegisterRequest("Carol", "carol@example.com", "Password1");
        var result = mvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn();
        token = om.readTree(result.getResponse().getContentAsString())
                  .at("/data/accessToken").asText();
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @Test @Order(2)
    void createLink_returns201WithShortUrl() throws Exception {
        var body = new CreateLinkRequest("https://spring.io", null, "Spring IO", null, null);
        var result = mvc.perform(post("/api/v1/links")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.shortUrl").isNotEmpty())
                .andExpect(jsonPath("$.data.originalUrl").value("https://spring.io"))
                .andExpect(jsonPath("$.data.status").value("active"))
                .andReturn();
        linkId = om.readTree(result.getResponse().getContentAsString())
                   .at("/data/id").longValue();
    }

    @Test @Order(3)
    void createLink_withCustomAlias_usesAlias() throws Exception {
        var body = new CreateLinkRequest("https://github.com", "gh-home", null, null, null);
        mvc.perform(post("/api/v1/links")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.customAlias").value("gh-home"))
                .andExpect(jsonPath("$.data.shortUrl", containsString("gh-home")));
    }

    @Test @Order(4)
    void createLink_duplicateAlias_returns409() throws Exception {
        var body = new CreateLinkRequest("https://github.com", "gh-home", null, null, null);
        mvc.perform(post("/api/v1/links")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isConflict());
    }

    @Test @Order(5)
    void createLink_privateIp_returns400() throws Exception {
        var body = new CreateLinkRequest("http://192.168.1.1/admin", null, null, null, null);
        mvc.perform(post("/api/v1/links")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    // ── List ─────────────────────────────────────────────────────────────────

    @Test @Order(6)
    void listLinks_returnsOwnedLinks() throws Exception {
        mvc.perform(get("/api/v1/links")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.pagination.total", greaterThanOrEqualTo(2)));
    }

    @Test @Order(7)
    void listLinks_withSearchFilter() throws Exception {
        mvc.perform(get("/api/v1/links?search=spring")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].originalUrl", containsStringIgnoringCase("spring")));
    }

    // ── Get one ──────────────────────────────────────────────────────────────

    @Test @Order(8)
    void getLink_ownedById_returns200() throws Exception {
        mvc.perform(get("/api/v1/links/" + linkId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(linkId));
    }

    @Test @Order(9)
    void getLink_notOwnedById_returns404() throws Exception {
        mvc.perform(get("/api/v1/links/99999")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    // ── Update ───────────────────────────────────────────────────────────────

    @Test @Order(10)
    void updateLink_changesTitle() throws Exception {
        var body = new UpdateLinkRequest(null, "Updated Title", null, null);
        mvc.perform(patch("/api/v1/links/" + linkId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated Title"));
    }

    @Test @Order(11)
    void updateLink_disablesLink() throws Exception {
        var body = new UpdateLinkRequest(null, null, null, LinkStatus.DISABLED);
        mvc.perform(patch("/api/v1/links/" + linkId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("disabled"));
    }

    // ── Delete ───────────────────────────────────────────────────────────────

    @Test @Order(12)
    void deleteLink_ownedLink_returns204() throws Exception {
        mvc.perform(delete("/api/v1/links/" + linkId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    @Test @Order(13)
    void getLink_afterDelete_returns404() throws Exception {
        mvc.perform(get("/api/v1/links/" + linkId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    // ── Redirect ─────────────────────────────────────────────────────────────

    @Test @Order(14)
    void redirect_knownCode_returns302() throws Exception {
        // gh-home was created and is still active
        mvc.perform(get("/gh-home"))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "https://github.com"));
    }

    @Test @Order(15)
    void redirect_unknownCode_returns404() throws Exception {
        mvc.perform(get("/zzzzzzzzz"))
                .andExpect(status().isNotFound());
    }

    // ── Unauthenticated access ────────────────────────────────────────────────

    @Test @Order(16)
    void createLink_withoutToken_returns403() throws Exception {
        var body = new CreateLinkRequest("https://example.com", null, null, null, null);
        mvc.perform(post("/api/v1/links")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(body)))
                .andExpect(status().isForbidden());
    }

    // ── Bulk ─────────────────────────────────────────────────────────────────

    @Test @Order(17)
    void bulkCreate_mixedValidAndInvalid_returnsMultiStatus() throws Exception {
        var body = """
                {"links":[
                  {"originalUrl":"https://example.com"},
                  {"originalUrl":"http://localhost/bad"},
                  {"originalUrl":"https://wikipedia.org"}
                ]}""";
        mvc.perform(post("/api/v1/links/bulk")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isMultiStatus())
                .andExpect(jsonPath("$.data.successCount").value(2))
                .andExpect(jsonPath("$.data.failureCount").value(1));
    }
}
