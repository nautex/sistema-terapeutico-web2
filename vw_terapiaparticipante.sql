alter VIEW vw_terapiaparticipante
AS
	SELECT
		a.IdTerapia
		,a.Numero
		,a.IdParticipante
		,b.IdPersona
		,if(c.Nombres IS NULL, '', c.Nombres) AS Participante
		,a.IdEstado
		,d.Abreviado AS Estado
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from terapiaparticipante a 
	left join participante b ON
		a.IdParticipante = b.IdParticipante
	left join persona c ON
		b.IdPersona = c.IdPersona
	LEFT JOIN catalogo d on
		a.IdEstado = d.IdCatalogo
	