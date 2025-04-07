package com.example.SE.Project.Repository;

import com.example.SE.Project.Model.DcMeeting;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class DcMeetingRepositoryTest {

    @Autowired
    private DcMeetingRepository repository;

    @Test
    public void testSaveAndFind() {
        DcMeeting meeting = new DcMeeting();
        meeting.setStudentName("John Doe");
        meeting.setSupervisorName("Dr. Smith");
        meeting.setMeetingDate(LocalDate.now());
        meeting.setAgenda("Research Review");

        repository.save(meeting);

        List<DcMeeting> all = repository.findAll();
        assertThat(all).isNotEmpty();
        assertThat(all.get(0).getStudentName()).isEqualTo("John Doe");
    }
}
