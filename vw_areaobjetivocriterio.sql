create VIEW vw_areaobjetivocriterio
AS
	SELECT
		a.IdAreaObjetivoCriterio
		,a.IdAreaObjetivo
		
		,b.IdModelo
		,b.CodigoModelo
		,b.Modelo
		
		,b.IdArea
		,b.CodigoArea
		,b.Area
		
		,b.IdDestreza
		,b.CodigoDestreza
		,b.Destreza

		,b.Codigo AS CodigoObjetivo
		,b.Nombre AS Objetivo
		#,b.Descripcion
		,b.Orden AS OrdenObjetivo
		,b.Pregunta AS PreguntaObjetivo
		,b.Ejemplo AS EjemploObjetivo
		
		,a.Valor
		,a.Descripcion
		,a.Orden
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from areaobjetivocriterio a
	LEFT JOIN vw_areaobjetivo b on
		a.IdAreaObjetivo = b.IdAreaObjetivo
	
