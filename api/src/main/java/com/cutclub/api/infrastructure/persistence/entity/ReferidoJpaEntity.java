package com.cutclub.api.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "referidos")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReferidoJpaEntity {

    @Id
    private UUID id;

    @Column(name = "referente_id", nullable = false)
    private UUID referenteId;

    @Column(name = "referido_id", nullable = false)
    private UUID referidoId;

    @Column(nullable = false, length = 30)
    private String estado;
}
