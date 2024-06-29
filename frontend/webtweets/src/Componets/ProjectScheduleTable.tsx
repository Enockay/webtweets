import { ProjectSchedule } from './Context'; // Ensure to have the types defined in a types file

interface ProjectScheduleTableProps {
  projectSchedules: ProjectSchedule[];
  openModal: (fileURL: string, fileType: string) => void;
  getStatusColor: (status: string) => string;
}

const ProjectScheduleTable: React.FC<ProjectScheduleTableProps> = ({ projectSchedules, openModal, getStatusColor }) => {
  return (
    <section className="p-3">
      <h4 className="text-xl font-bold mb-4">Project Schedules</h4>
      <div className="overflow-x-auto bg-slate-600 min-h-60 scrollbar-hide">
        <table className="min-w-full bg-gray-800">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700">Time</th>
              <th className="py-2 px-4 border-b border-gray-700">Platform</th>
              <th className="py-2 px-4 border-b border-gray-700">Content</th>
              <th className="py-2 px-4 border-b border-gray-700">Status</th>
              <th className="py-2 px-4 border-b border-gray-700">Media</th>
              <th className="py-2 px-4 border-b border-gray-700">User Details</th>
            </tr>
          </thead>
          <tbody>
            {projectSchedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-700">{new Date(schedule.scheduledTime).toLocaleString()}</td>
                <td className="py-2 px-4 border-b border-gray-700">{schedule.platform}</td>
                <td className="py-2 px-4 border-b border-gray-700">{schedule.content}</td>
                <td className={`py-2 px-4 border-b border-gray-700 ${getStatusColor(schedule.state)}`}>{schedule.state}</td>
                <td className="py-2 px-4 border-b border-gray-700">
                  {schedule.fileURL ? (
                    <div className="mt-2">
                      {schedule.fileType?.startsWith('image/') && (
                        <center>
                          <img
                            src={schedule.fileURL}
                            alt="img"
                            className="max-w-20 max-h-20 object-contain cursor-pointer" // Adjust the dimensions to fit within the table cell
                            onClick={() => openModal(schedule.fileURL as string, schedule.fileType as string)}
                          />
                        </center>
                      )}
                      {schedule.fileType?.startsWith('video/') && (
                        <center>
                          <video
                            controls
                            className="max-w-20 max-h-20 object-contain cursor-pointer" // Adjust the dimensions to fit within the table cell
                            onClick={() => openModal(schedule.fileURL as string, schedule.fileType as string)}
                          >
                            <source src={schedule.fileURL} type={schedule.fileType} />
                            Your browser does not support the video tag.
                          </video>
                        </center>
                      )}
                    </div>
                  ) : (
                    <p>No File</p>
                  )}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">
                  {schedule.userDetails && (
                    <div className="flex items-center">
                      <img
                        src={schedule.userDetails.profileImageUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover inline-block mr-2"
                      />
                      <span>{schedule.userDetails.username}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProjectScheduleTable;
