import {
  CollectorService,
  PointsWalletService,
  ShiftsService,
  ShiftsWalletService,
  UserService,
} from "../service/service.js";

export const getShifts = async (req, res) => {
  try {
    const result = await ShiftsService.get();
    if (!result) return res.sendRequestError("Petición incorrecta");

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const getByIdShift = async (req, res) => {
  try {
    const sid = req.params.sid;
    const result = await ShiftsService.getById(sid);
    if (!result) return res.sendRequestError("petición incorrecta");
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const createShift = async (req, res) => {
  try {
    const user = req.user.tokenInfo;
    const data = req.body;
    //turno en collecion turnos no confirmados

    const result = await ShiftsService.create({
      date: data.date,
      hour: data.hour,
      street: user.street,
      height: user.height,
      emailUser: user.email,
      recyclingNumber: user.recyclingNumber,
      points: data.points,
    });
    if (!result)
      return res.sendRequestError("Petición incorrecta, turno no agendado");

    //ingreso el turno en la billetera turnos del user
    const shiftsWalletIDUser= user.shiftsWallet.toString();
    const shiftsWalletUser= await ShiftsWalletService.getById(shiftsWalletIDUser);
    const shift= {_id: result._id};
    shiftsWalletUser.shiftsNotConfirmed.push({shift: shift});
    await ShiftsWalletService.update({_id: shiftsWalletIDUser}, shiftsWalletUser);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateShiftConfirmed = async (req, res) => {
  //solo recolectores
  try {
    const sid = req.params.sid;
    const collector = req.user.tokenInfo;
    const sw_id = collector.shiftsWallet.toString();

    const shiftNotConfirmed = await ShiftsService.getById(sid); //turno del usuario
    const shiftsWalletCollector = await ShiftsWalletService.getById(sw_id);

    if (!shiftNotConfirmed) return res.sendRequestError("Petición incorrecta");

    const shift = {
      _id: shiftNotConfirmed._id.toString(), //solo guardo _id string
      state: "confirmed",
      collector: `${collector.first_name} ${collector.last_name}`,
      emailCollector: collector.email,
      collectionNumberCollector: collector.collectionNumber,
      date: shiftNotConfirmed.date,
      hour: shiftNotConfirmed.hour,
      street: shiftNotConfirmed.street,
      height: shiftNotConfirmed.height,
      emailUser: shiftNotConfirmed.emailUser,
      recyclingNumber: shiftNotConfirmed.recyclingNumber,
      points: shiftNotConfirmed.points,
      activatedPoints: shiftNotConfirmed.activatedPoints,
    };
    //COLLECTOR. ingreso el turno en la wallet
    shiftsWalletCollector.shiftsConfirmed.push({ shift: shift });
    const result = await ShiftsWalletService.update(
      { _id: sw_id },
      shiftsWalletCollector
    );

    //USER.ingreso el turno en la wallet
    const user= await UserService.getEmail({email:shiftNotConfirmed.emailUser});
    const swUser_id= user.shiftsWallet.toString();
    const shiftsWalletUser= await ShiftsWalletService.getById(swUser_id);
    shiftsWalletUser.shiftsConfirmed.push({shift: shift});
    shiftsWalletUser.shiftsNotConfirmed.length = 0
    await ShiftsWalletService.update({_id: swUser_id}, shiftsWalletUser);


    //elimino el turno de la coleccion general de turnos no confirmados
    await ShiftsService.delete(sid);

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export const updateDoneShift = async (req, res) => {
  try {
    const scid = req.params.scid;
    const done = req.body.done; //(true)
    const editKG = req.body.kg; //para editar points del user
    const collector = req.user.tokenInfo;
    const shiftsWalletID = collector.shiftsWallet.toString();
    // console.log(editKG);

    //tengo que traer la billetera de turnos, y allí dentro buscar este turno y modificarlo
    const shiftsWallet = await ShiftsWalletService.getById(shiftsWalletID);

    if (!shiftsWallet) return res.sendRequestError("Petición incorrecta");

    await shiftsWallet.shifts.map(async(item) => {
      //si collector modifica kg por body
      if (
          item.shiftConfirmed._id == scid &&
          editKG && //hay kg en body para editar  points
          item.shiftConfirmed.emailCollector == collector.email //solo recolector que confirmó el turno, puede darle done: true
      ) {
        item.shiftConfirmed.done = done;
        item.shiftConfirmed.points = editKG;
      }
      if (
        item.shiftConfirmed._id == scid &&
        !editKG&& //no hay kg para editar
        item.shiftConfirmed.emailCollector == collector.email
      ) {
        item.shiftConfirmed.done = done;
      }
 //al quedar el turno en done, los puntos del reciclado se colocan en la pointsWallet del user, en notEnabledPoints
    //y luego en finalized se le habilitarán  a la propiedad enabledpoints
    const user = await UserService.getEmail({
      email: item.shiftConfirmed.emailUser,
    });
    const pointsWalletID = user.pointsWallet.toString();
    await PointsWalletService.update(pointsWalletID, {
      notEnabledPoints: item.shiftConfirmed.points,
    });

    //actualizo el numero de reciclaje del usuario
    await UserService.update(
      { _id: user._id.toString() },
      { recyclingNumber: user.recyclingNumber + 1 }
    );

    });
    //actualizo billetera turnos con los turnos done:true
    const result = await ShiftsWalletService.update(
      shiftsWalletID,
      shiftsWallet
    );
    //actualizo nro de recolecciones del recolector, añadiendole 1(recién finalizada)
    const collectorDB= await CollectorService.getById(collector._id.toString()) //collector database
    // console.log(collectorDB);
    await CollectorService.update({_id: collector._id.toString()},
      {collectionNumber: collectorDB.collectionNumber + 1})

    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};


export const finalizedProcess = async (req, res) => {
  //solo admincollector
  try {
    const cid = req.params.cid; //(cid= Collector ID)
    const collector = await CollectorService.getById(cid);
    const pointsWalletCollectorID = collector.pointsWallet.toString();
    const shiftswalletID = collector.shiftsWallet.toString();

    let pointsWalletCollector = await PointsWalletService.getById(
      pointsWalletCollectorID
    );
    const shiftsWallet = await ShiftsWalletService.getById(shiftswalletID);
    // console.log(shiftsWallet.shifts);

    let points = 0;

    shiftsWallet.shifts.map(async (item) => {
      if (
        item.shiftConfirmed.done === true && 
        item.shiftConfirmed.activatedPoints === false//solo suma puntos cuando activatedPoints esta en false
      ) {
        item.shiftConfirmed.activatedPoints = "true"; //activan los puntos y queda inutilizado
        points = points + item.shiftConfirmed.points;

        //actualizo la billetera de puntos del usuario, habilitándole los puntos no habilitados
        const user = await UserService.getEmail({
          email: item.shiftConfirmed.emailUser,
        });
        const pointsWalletUserID = user.pointsWallet.toString();
        const pointsWalletUser = await PointsWalletService.getById(
          pointsWalletUserID
        );

        await PointsWalletService.update(
          { _id: pointsWalletUserID },
          {
            enabledPoints:
              pointsWalletUser.enabledPoints +
              pointsWalletUser.notEnabledPoints,
            notEnabledPoints: 0,
          }
        );
      }
    });

    //cuando no hay turnos por finalizar
    if (points === 0)
      return res.status(206).json({
        message:
          "Todos sus puntos ya fueron habilitados, confirme nuevos turnos para seguir ganando puntos",
      });

    //actualizo billetera de turnos de collector
    await ShiftsWalletService.update({ _id: shiftswalletID }, shiftsWallet);

    //actualizo la billetera de puntos del collector OK
    await PointsWalletService.update(
      { _id: pointsWalletCollectorID },
      { enabledPoints: pointsWalletCollector.enabledPoints + points }
    );

    res.sendSuccess("Puntos habilitados");
  } catch (error) {
    res.sendServerError(error.message);
  }
};
