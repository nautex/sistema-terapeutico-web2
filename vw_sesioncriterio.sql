alter VIEW vw_sesioncriterio
AS
	SELECT
		a.IdSesion
		,a.Numero
		,a.IdAreaObjetivoCriterio
		
		,b.IdModelo
		,b.CodigoModelo
		,b.Modelo
		
		,b.IdArea
		,b.CodigoArea
		,b.Area
		
		,b.IdAreaObjetivo
		,b.CodigoObjetivo
		,b.Objetivo
		,b.OrdenObjetivo
		,b.PreguntaObjetivo
		,b.EjemploObjetivo
		
		,b.Valor AS ValorCriterio
		,b.Descripcion AS Criterio
		,b.Orden AS OrdenCriterio
		
		,a.IdPuntuacionGrupo
		,c.Descripcion AS PuntuacionGrupo
		
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from sesioncriterio a 
	left join vw_areaobjetivocriterio b ON
		a.IdAreaObjetivoCriterio = b.IdAreaObjetivoCriterio
	LEFT JOIN puntuaciongrupo c on
		a.IdPuntuacionGrupo = c.IdPuntuacionGrupo
	
