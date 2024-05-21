alter VIEW vw_participantepersonaautorizada
AS
	SELECT
		a.IdParticipante
		,a.Numero
		,a.IdPersona
		,b.Nombres AS Persona
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	FROM participantepersonaautorizada a
	left join persona b on
		a.IdPersona = b.IdPersona
