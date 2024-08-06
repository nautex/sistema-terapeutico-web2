alter VIEW vw_terapiaparticipanteresumen
AS
	with ltbl_terapiaterapeuta AS 
	(
		/*SELECT
			a.IdTerapia
			,GROUP_CONCAT(if(c.Seudonimo IS NULL, b.Nombres, c.Seudonimo) SEPARATOR ' - ') AS Terapeutas
		FROM terapiaterapeuta a 
		left join persona b ON
			a.IdTerapeuta = b.IdPersona
		left join trabajador c ON
			a.IdTerapeuta = c.IdTrabajador
		GROUP BY
			a.IdTerapia*/
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
	SELECT
		row_number() OVER (ORDER BY a.IdTerapia,a.Numero)  AS Id
		,a.IdTerapia
		,a.Numero
		,b.IdTipo AS IdTipoTerapia
		,b.Tipo AS TipoTerapia
		,h.IdPadre AS IdTipoTerapiaPadre
		,a.IdParticipante
		,a.IdPersona
		,a.Participante
		,g.IdTerapeuta
		,if(g.Terapeuta IS NULL, '-', g.Terapeuta) AS Terapeuta
		,b.IdTarifa
		,a.IdEstado
		,a.Estado
	from vw_terapiaparticipante a 
	inner join vw_terapia b ON
		a.IdTerapia = b.IdTerapia
		AND b.IdEstado = 2
	LEFT JOIN ltbl_terapiaterapeuta g on
		a.IdTerapia = g.IdTerapia
		AND g.Orden = 1
	LEFT JOIN catalogogrupo h on
		b.IdTipo = h.IdHijo
		AND h.IdGrupo = 1
	