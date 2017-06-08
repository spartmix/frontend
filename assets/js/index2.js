var TaskManager = function () {
    var self = this;

    self.taskToAdd = ko.observable("");
    self.allTasks = ko.observableArray(["Fazer alguma coisa com knockout", "..."]);
    self.addTaskComplete = ko.observable("");
    self.taskComplete = ko.observableArray(["teste"]);
    self.selectedTasks = ko.observableArray();

    self.addTask = function () {
        if ((self.taskToAdd() != "") && (self.allTasks.indexOf(self.taskToAdd()) < 0))

            self.allTasks.push(self.taskToAdd());
        self.taskToAdd();
    };

    self.completeTask = function() {
        console.log(self.taskComplete, self.selectedTasks())
        self.taskComplete.push(self.selectedTasks());
        self.allTasks.removeAll(self.selectedTasks());
        self.selectedTasks([]);
    };
};

ko.applyBindings(new TaskManager());