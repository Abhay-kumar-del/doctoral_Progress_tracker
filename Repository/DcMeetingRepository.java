package com.example.SE.Project.Repository;

import com.example.SE.Project.Model.DcMeeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DcMeetingRepository extends JpaRepository<DcMeeting, Long> {
}
