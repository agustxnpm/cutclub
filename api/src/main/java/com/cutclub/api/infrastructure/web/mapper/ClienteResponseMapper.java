package com.cutclub.api.infrastructure.web.mapper;

import com.cutclub.api.domain.model.Beneficio;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.model.Corte;
import com.cutclub.api.domain.model.PerfilCliente;
import com.cutclub.api.infrastructure.web.dto.BeneficioResponse;
import com.cutclub.api.infrastructure.web.dto.ClienteResponse;
import com.cutclub.api.infrastructure.web.dto.CorteResponse;
import com.cutclub.api.infrastructure.web.dto.PerfilClienteResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ClienteResponseMapper {

    public ClienteResponse toResponse(Cliente cliente) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getTelefono(),
                cliente.getCodigoReferido(),
                cliente.getContadorFidelidad()
        );
    }

    public PerfilClienteResponse toResponse(PerfilCliente perfil) {
        Cliente c = perfil.cliente();

        CorteResponse ultimoCorte = null;
        if (perfil.ultimoCorte() != null) {
            Corte corte = perfil.ultimoCorte();
            ultimoCorte = new CorteResponse(corte.id(), corte.fecha(), corte.tipo(), corte.notas());
        }

        List<BeneficioResponse> beneficios = perfil.beneficiosDisponibles().stream()
                .map(this::toResponse)
                .toList();

        return new PerfilClienteResponse(
                c.getId(), c.getNombre(), c.getTelefono(),
                c.getCodigoReferido(), c.getContadorFidelidad(),
                ultimoCorte, beneficios
        );
    }

    private BeneficioResponse toResponse(Beneficio beneficio) {
        return new BeneficioResponse(beneficio.id(), beneficio.tipo(), beneficio.fechaCreacion());
    }
}
