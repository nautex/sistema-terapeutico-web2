alter VIEW vw_terapia
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
	SELECT
		a.IdTerapia
		,a.IdLocal
		,b.Nombre AS Local
		,a.IdTarifa
		,g.Codigo AS CodigoServicio
		,c.Codigo AS CodigoTarifa
		,c.Monto AS MontoTarifa
		,a.FechaInicio
		,a.IdTipo
		,h.Descripcion AS Tipo
		,a.IdModalidad
		,d.Descripcion AS Modalidad
		,a.SesionesMes
		,a.MinutosSesion
		,a.IdSalon
		,e.Codigo AS Salon
		,i.IdTerapeuta
		,if(i.Terapeuta IS NULL, '', i.Terapeuta) AS Terapeuta
		,j.IdParticipante
		,if(j.Participante IS NULL, '', j.Participante) AS Participante
		,a.IdEstado
		,f.Abreviado AS Estado
		,a.Observaciones
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from terapia a 
	left join local b ON
		a.IdLocal = b.IdLocal
	left join tarifa c ON
		a.IdTarifa = c.IdTarifa
	left join catalogo d ON
		a.IdModalidad = d.IdCatalogo
	left join salon e ON
		a.IdSalon = e.IdSalon
	left join catalogo f ON
		a.IdEstado = f.IdCatalogo
	left join servicio g ON
		c.IdServicio = g.IdServicio
	left join catalogo h ON
		a.IdTipo = h.IdCatalogo
	LEFT JOIN ltbl_terapiaterapeuta i ON
		a.IdTerapia = i.IdTerapia
		AND i.Orden = 1
	LEFT JOIN ltbl_terapiaparticipante j ON
		a.IdTerapia = j.IdTerapia
		AND j.Orden = 1
		
	