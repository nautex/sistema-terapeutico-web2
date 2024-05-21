ALTER VIEW vw_participantealergia
AS
	SELECT
		a.IdParticipante
		,a.Numero
		,a.IdTipoAlergia
		,b.Descripcion AS TipoAlergia
		,a.Detalle
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	FROM participantealergia a
	left join catalogo b on
		a.IdTipoAlergia = b.idcatalogo
