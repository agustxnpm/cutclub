package com.cutclub.api.infrastructure.security;

import com.cutclub.api.domain.model.Rol;
import com.cutclub.api.domain.model.Usuario;
import com.cutclub.api.domain.port.TokenProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Implementación JWT del puerto TokenProvider, basada en jjwt 0.12.x.
 *
 * Configuración (application.yaml):
 * - cutclub.security.jwt.secret: clave HMAC en base64 o texto plano (mínimo 32 bytes).
 * - cutclub.security.jwt.expiration-ms: vigencia del token en milisegundos.
 */
public class JwtTokenProvider implements TokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);
    private static final String CLAIM_ROLES = "roles";

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtTokenProvider(String secret, long expirationMs) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException(
                    "El secreto JWT debe tener al menos 32 bytes para HS256");
        }
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    @Override
    public String generarToken(Usuario usuario) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + expirationMs);

        List<String> roles = usuario.getRoles().stream()
                .map(Enum::name)
                .toList();

        return Jwts.builder()
                .subject(usuario.getTelefono())
                .claim(CLAIM_ROLES, roles)
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    @Override
    public Optional<DatosToken> validar(String token) {
        try {
            Jws<Claims> jws = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);

            Claims claims = jws.getPayload();
            String telefono = claims.getSubject();
            Set<Rol> roles = extraerRoles(claims);
            return Optional.of(new DatosToken(telefono, roles));
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("Token JWT inválido: {}", ex.getMessage());
            return Optional.empty();
        }
    }

    @SuppressWarnings("unchecked")
    private Set<Rol> extraerRoles(Claims claims) {
        Object raw = claims.get(CLAIM_ROLES);
        if (!(raw instanceof List<?> lista) || lista.isEmpty()) {
            return EnumSet.noneOf(Rol.class);
        }
        EnumSet<Rol> roles = EnumSet.noneOf(Rol.class);
        for (Object valor : (List<Object>) lista) {
            if (valor != null) {
                try {
                    roles.add(Rol.valueOf(valor.toString()));
                } catch (IllegalArgumentException ignored) {
                    // rol desconocido en el token: se descarta sin invalidar el resto
                }
            }
        }
        return roles;
    }
}
