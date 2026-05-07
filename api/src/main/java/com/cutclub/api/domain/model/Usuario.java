package com.cutclub.api.domain.model;

import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;
import java.util.UUID;

/**
 * Entidad de dominio que representa una identidad autenticable del sistema.
 *
 * Invariantes:
 * - id, telefono y passwordHash son obligatorios.
 * - roles no puede estar vacío.
 * - activo refleja el estado de la licencia SaaS (false = bloqueado por falta de pago).
 *
 * Notas:
 * - Java puro: sin anotaciones de Spring/JPA.
 * - El telefono actúa como username para login.
 */
public class Usuario {

    private final UUID id;
    private final String telefono;
    private final String passwordHash;
    private final Set<Rol> roles;
    private boolean activo;

    private Usuario(UUID id, String telefono, String passwordHash, Set<Rol> roles, boolean activo) {
        this.id = id;
        this.telefono = telefono;
        this.passwordHash = passwordHash;
        this.roles = EnumSet.copyOf(roles);
        this.activo = activo;
    }

    /**
     * Crea un Usuario nuevo con id generado automáticamente y estado activo.
     */
    public static Usuario crearNuevo(String telefono, String passwordHash, Set<Rol> roles) {
        validar(telefono, passwordHash, roles);
        return new Usuario(UUID.randomUUID(), telefono, passwordHash, roles, true);
    }

    /**
     * Reconstruye un Usuario existente desde persistencia, preservando su id y estado.
     */
    public static Usuario reconstruir(UUID id, String telefono, String passwordHash, Set<Rol> roles, boolean activo) {
        if (id == null) {
            throw new IllegalArgumentException("El id del usuario es obligatorio");
        }
        validar(telefono, passwordHash, roles);
        return new Usuario(id, telefono, passwordHash, roles, activo);
    }

    private static void validar(String telefono, String passwordHash, Set<Rol> roles) {
        if (telefono == null || telefono.isBlank()) {
            throw new IllegalArgumentException("El teléfono del usuario es obligatorio");
        }
        if (passwordHash == null || passwordHash.isBlank()) {
            throw new IllegalArgumentException("El passwordHash del usuario es obligatorio");
        }
        if (roles == null || roles.isEmpty()) {
            throw new IllegalArgumentException("El usuario debe tener al menos un rol");
        }
    }

    public UUID getId() {
        return id;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Set<Rol> getRoles() {
        return Collections.unmodifiableSet(roles);
    }

    public boolean isActivo() {
        return activo;
    }

    public boolean tieneRol(Rol rol) {
        return roles.contains(rol);
    }

    /**
     * Reactiva el usuario (ej. cuando se confirma el pago de la licencia SaaS).
     */
    public void activar() {
        this.activo = true;
    }

    /**
     * Bloquea el acceso del usuario (ej. cuando se vence la licencia SaaS).
     */
    public void desactivar() {
        this.activo = false;
    }
}
