package com.cutclub.api.infrastructure.persistence.entity;

import com.cutclub.api.domain.model.EstadoBeneficio;
import com.cutclub.api.domain.model.TipoBeneficio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "beneficios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BeneficioJpaEntity {

    @Id
    private UUID id;

    @Column(name = "cliente_id", nullable = false)
    private UUID clienteId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoBeneficio tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoBeneficio estado;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
}
