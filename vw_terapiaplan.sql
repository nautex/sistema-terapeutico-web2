alter VIEW vw_terapiaplan
AS
	with ltbl_terapiaterapeuta AS 
	(
		SELECT
			a.IdTerapia
			,ROW_NUMBER() OVER (PARTITION BY a.IdTerapia ORDER BY a.IdTerapia, a.Numero)  AS Orden
			,a.IdTerapeuta
			,if(c.Seudonimo IS NULL, b.Nombres, c.Seudonimo) AS Terapeuta
		FROM terapiaterapeuta a 
		left join persona b ON
			a.IdTerapeuta = b.IdPersona
		left join trabajador c ON
			a.IdTerapeuta = c.IdTrabajador
		where
			a.IdTipoCargo = 54
			and a.IdEstado = 2
	)
	, ltbl_terapiaparticipante AS 
	(
		SELECT
			a.IdTerapia
			,ROW_NUMBER() OVER (PARTITION BY a.IdTerapia ORDER BY a.IdTerapia, a.Numero)  AS Orden
			,a.IdParticipante
			,c.Nombres AS Participante
		FROM terapiaparticipante a
		LEFT JOIN participante b on
			a.IdParticipante = b.IdParticipante
		left join persona c ON
			b.IdPersona = c.IdPersona
	)
	select
		a.IdTerapiaPlan
		, a.IdTerapia
		, b.IdTerapeuta
		, b.Terapeuta
		, c.IdParticipante
		, c.Participante
		, a.IdPeriodo
		, d.Codigo AS CodigoPeriodo
		, d.FechaInicio AS FechaInicioPeriodo
		, d.FechaFin AS FechaFinPeriodo
		, a.FechaInicio
		, a.IdEstadoVigencia
		, f.Descripcion AS EstadoVigencia
		, a.IdEstado
		, e.Codigo Estado
		, a.FechaRegistro
		, a.UsuarioRegistro
		, a.FechaModificacion
		, a.UsuarioModificacion
	FROM terapiaplan a
	LEFT JOIN ltbl_terapiaterapeuta b on
		a.IdTerapia = b.IdTerapia
		AND b.Orden = 1
	LEFT JOIN ltbl_terapiaparticipante c on
		a.IdTerapia = c.IdTerapia
		AND c.Orden = 1
	LEFT JOIN periodo d on
		a.IdPeriodo = d.IdPeriodo
	LEFT JOIN catalogo e on
		a.IdEstado = e.IdCatalogo
	LEFT JOIN catalogo f on
		a.IdEstadoVigencia = f.IdCatalogo
