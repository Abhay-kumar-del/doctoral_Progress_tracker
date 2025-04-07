package com.example.SE.Project.Repository;

import com.example.SE.Project.Model.Publication;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class PublicationRepositoryTest {

    @Autowired
    private PublicationRepository publicationRepository;

    @Test
    @DisplayName("Save and retrieve publication")
    public void testSaveAndFindPublication() {
        Publication publication = new Publication();
        publication.setTitle("Test Publication");
        publication.setAuthor("Author Name");
        publication.setYear("2024");
        publication.setJournal("Test Journal");

        publicationRepository.save(publication);

        List<Publication> publications = publicationRepository.findAll();

        assertThat(publications).isNotEmpty();
        assertThat(publications.get(0).getTitle()).isEqualTo("Test Publication");
    }

    @Test
    @DisplayName("Delete publication by ID")
    public void testDeletePublication() {
        Publication publication = new Publication();
        publication.setTitle("To Delete");
        publication.setAuthor("Author");
        publication.setYear("2023");
        publication.setJournal("Delete Journal");

        Publication saved = publicationRepository.save(publication);

        publicationRepository.deleteById(saved.getId());

        List<Publication> remaining = publicationRepository.findAll();
        assertThat(remaining).doesNotContain(saved);
    }
}
