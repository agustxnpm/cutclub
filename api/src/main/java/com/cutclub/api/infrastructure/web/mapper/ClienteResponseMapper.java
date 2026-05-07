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
import java.util.Map;
import java.util.UUID;

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

    public PerfilClienteResponse toResponse(PerfilCliente perfil, boolean esReferidoPendiente, String nombreReferente, Map<UUID, String> descripcionesBeneficios) {
        Cliente c = perfil.cliente();

        CorteResponse ultimoCorte = null;
        if (perfil.ultimoCorte() != null) {
            Corte corte = perfil.ultimoCorte();
            ultimoCorte = new CorteResponse(corte.id(), corte.tipoCorte(), corte.precio(), corte.fecha(), corte.esGratis());
        }

        List<BeneficioResponse> beneficios = perfil.beneficiosDisponibles().stream()
                .map(b -> toResponse(b, descripcionesBeneficios))
                .toList();

        List<CorteResponse> historial = perfil.historialCortes().stream()
                .map(corte -> new CorteResponse(corte.id(), corte.tipoCorte(), corte.precio(), corte.fecha(), corte.esGratis()))
                .toList();

        String fechaRegistro = c.getFechaRegistro() != null ? c.getFechaRegistro().toString() : null;

        return new PerfilClienteResponse(
                c.getId(), c.getNombre(), c.getTelefono(),
                c.getCodigoReferido(), c.getContadorFidelidad(),
                ultimoCorte, historial, beneficios, esReferidoPendiente, nombreReferente,
                fechaRegistro
        );
    }

    public PerfilClienteResponse toResponse(PerfilCliente perfil, boolean esReferidoPendiente, String nombreReferente) {
        return toResponse(perfil, esReferidoPendiente, nombreReferente, Map.of());
    }

    public PerfilClienteResponse toResponse(PerfilCliente perfil, boolean esReferidoPendiente) {
        return toResponse(perfil, esReferidoPendiente, null, Map.of());
    }

    public PerfilClienteResponse toResponse(PerfilCliente perfil) {
        return toResponse(perfil, false, null, Map.of());
    }

    private BeneficioResponse toResponse(Beneficio beneficio, Map<UUID, String> descripciones) {
        String descripcion = descripciones.getOrDefault(beneficio.getId(), "Beneficio activo");
        return new BeneficioResponse(beneficio.getId(), beneficio.getTipo().name(), beneficio.getFechaCreacion(), descripcion);
    }
}
