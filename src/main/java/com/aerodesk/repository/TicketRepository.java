package com.aerodesk.repository;

import com.aerodesk.model.Ticket;
import com.aerodesk.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aerodesk.enums.TicketPriority;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByPriority(TicketPriority priority);
    List<Ticket> findByAssignedTechnicianId(Long userId);
    List<Ticket> findByCategoryIgnoreCase(String category);
    long countByStatus(TicketStatus status);

    long countByPriority(TicketPriority priority);
}
