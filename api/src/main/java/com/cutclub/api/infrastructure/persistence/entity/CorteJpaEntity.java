package com.cutclub.api.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cortes")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CorteJpaEntity {

    @Id
    private UUID id;

    @Column(name = "cliente_id", nullable = false)
    private UUID clienteId;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(length = 50)
    private String tipo;

    @Column(length = 255)
    private String notas;
}
