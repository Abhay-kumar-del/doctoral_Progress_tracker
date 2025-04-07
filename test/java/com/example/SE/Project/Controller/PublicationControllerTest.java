package com.example.SE.Project.Controller;

import com.example.SE.Project.Model.Publication;
import com.example.SE.Project.Repository.PublicationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PublicationController.class)
public class PublicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private PublicationRepository publicationRepo;

    @Test
    public void testViewPublications() throws Exception {
        Publication publication = new Publication();
        publication.setId(1L);
        publication.setTitle("Sample Title");
        publication.setAuthor("Abhay");
        publication.setJournal("Test Journal");
        publication.setYear("2024");

        when(publicationRepo.findAll()).thenReturn(List.of(publication));

        mockMvc.perform(get("/publications"))
            .andExpect(status().isOk())
            .andExpect(model().attributeExists("publications"))
            .andExpect(view().name("publications"));
    }
}
