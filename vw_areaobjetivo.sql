create VIEW vw_areaobjetivo
AS
	SELECT
		a.IdAreaObjetivo
		,b.IdModelo
		,c.Codigo AS CodigoModelo
		,c.Nombre AS Modelo
		,a.IdArea
		,b.Codigo AS CodigoArea
		,b.Nombre AS Area
		,a.IdDestreza
		,d.Codigo AS CodigoDestreza
		,d.Nombre AS Destreza
		,a.Codigo
		,a.Nombre
		,a.Descripcion
		,a.Orden
		,a.Pregunta
		,a.Ejemplo
		,a.FechaRegistro
		,a.UsuarioRegistro
		,a.FechaModificacion
		,a.UsuarioModificacion
	from areaobjetivo a
	LEFT JOIN area b on
		a.IdArea = b.IdArea
	LEFT JOIN modelo c on
		b.IdModelo = c.IdModelo
	LEFT JOIN destreza d on
		a.IdDestreza = d.IdDestreza
	
