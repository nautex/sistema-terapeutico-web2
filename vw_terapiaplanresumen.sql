alter VIEW vw_terapiaplanresumen
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
		row_number() OVER (ORDER BY a.IdTerapia, b.IdTerapiaPlan) AS Id
		, a.IdTerapia
		, b.IdTerapiaPlan
		, a.IdLocal
		, f.Codigo AS CodigoLocal
		, f.Nombre AS Local
		, c.IdTerapeuta
		, if(c.Terapeuta IS NULL, '', c.Terapeuta) AS Terapeuta
		, d.IdParticipante
		, if(d.Participante IS NULL, '', d.Participante) AS Participante
		, b.IdPeriodo
		, e.Codigo AS CodigoPeriodo
		, e.FechaInicio AS FechaInicioPeriodo
		, e.FechaFin AS FechaFinPeriodo
		, b.FechaInicio
		, b.IdEstadoVigencia
		, h.Descripcion AS EstadoVigencia
		, b.IdEstado
		, g.Codigo AS Estado
	FROM terapia a
	LEFT JOIN terapiaplan b on
		a.IdTerapia = b.IdTerapia
		AND b.IdEstado = 2
	LEFT JOIN ltbl_terapiaterapeuta c on
		a.IdTerapia = c.IdTerapia
		AND c.Orden = 1
	LEFT JOIN ltbl_terapiaparticipante d on
		a.IdTerapia = d.IdTerapia
		AND d.Orden = 1
	LEFT JOIN periodo e on
		b.IdPeriodo = e.IdPeriodo
	LEFT JOIN local f on
		a.IdLocal = f.IdLocal
	LEFT JOIN catalogo g on
		b.IdEstado = g.IdCatalogo
	LEFT JOIN catalogo h on
		b.IdEstadoVigencia = h.IdCatalogo
	where
		a.IdEstado = 2
