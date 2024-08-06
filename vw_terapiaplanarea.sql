alter VIEW vw_terapiaplanarea
AS
	select
		a.IdTerapiaPlan
		, a.Numero
		, d.IdTerapia
		, a.IdArea
		, b.Codigo AS CodigoArea
		, b.Orden AS OrdenArea
		, b.Nombre AS Area
		, b.IdModelo
		, c.Codigo AS CodigoModelo
		, c.Nombre AS Modelo
		, a.Orden
		, a.FechaRegistro
		, a.UsuarioRegistro
		, a.FechaModificacion
		, a.UsuarioModificacion
	FROM terapiaplanarea a
	LEFT JOIN area b on
		a.IdArea = b.IdArea
	LEFT JOIN modelo c on
		b.IdModelo = c.IdModelo
	LEFT JOIN terapiaplan d on
		a.IdTerapiaPlan = d.IdTerapiaPlan
	